var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var scmsg = system.functions.scmsg;
var msg = system.functions.msg;
var cursor_field_name_set = system.functions.cursor_field_name_set;
var getElement = lib.xmlHelpers.getElement;
var getRelationTypeList = lib.RelationUtil.getRelationTypeList;
var getRelationFileName = lib.RelationUtil.getRelationFileName;
var getDescription = lib.QueryEditorParser.getDescription;

var msgCls = "local:runAction";
var btActionPattern = /\$L\.wfEvent="([^"]*)"/;

function getWorkflowsByTable(tableName) {
  var workflows = [];
  $("Workflow").select('tableName="' + tableName + '"').iterate(
          function(workflow) {
            workflows.push(workflow["name"]);
          });

  return workflows;
}

function getRuleSetTableName(actionType, relationType, queryFileName, tablename) {
  var ruleSetTableName = null;
  if (actionType == 1) {
    ruleSetTableName = getRelationFileName(relationType);
  } else if (actionType == 2) {
    ruleSetTableName = queryFileName;
  } else if (actionType == 3) {
    ruleSetTableName = tablename;
  }
  return ruleSetTableName;
}

function getBackendTransitionsByTable(tableName, actionType) {
  var objs = [];

  if (tableName != null) {
    $("Workflow").select('tableName="' + tableName + '"').iterate(
            function(workflow) {
              var backendTransitions = workflow["backendTransition"];
              if (backendTransitions != null) {
                for (var i = 0, iLoopTimes = backendTransitions.length(); i < iLoopTimes; i++) {
                  var backendTransition = backendTransitions[i];
                  var btAction = backendTransition["btAction"];
                  // get btAction from the condition definition if it is not configured
                  if (btAction == null) {
                    var btCondition = backendTransition["btCondition"];
                    if (btCondition != null) {
                      btCondition = system.functions.str(btCondition);
                      var matchResult = btCondition.match(btActionPattern);
                      if (matchResult != null) {
                        btAction = matchResult[1];
                      }
                    }
                  }

                  if (btAction != null) {
                    var obj = _.findWhere(objs, {
                      value: btAction
                    });
                    if (obj != null) {
                      obj.workflows.push(workflow["name"]);
                    } else {
                      var dispMsg = scmsg("btName", msgCls, $
                              .createSCArray(btAction));
                      objs.push({
                        value: btAction,
                        disp: dispMsg,
                        workflows: [workflow["name"]]
                      });
                    }
                  }
                }
              }
            });
  }

  if (objs.length > 0) {
    objs = _.sortBy(objs, "disp");
  }

  objs.unshift({
    value: "1",
    disp: scmsg("save", msgCls),
    workflows: []
  });

  // for current record, there is no action of "do nothing"
  if (actionType != 3) {
    objs.unshift({
      value: "0",
      disp: scmsg("donothing", msgCls),
      workflows: []
    });
  }

  return objs;
}

function getRuleSetQuery(tableName, currentRuleSet) {
  var query = 'null(tablename)';
  if (tableName != null) {
    query = 'tablename="' + tableName + '" OR null(tablename)';
  }
  query = '(' + query + ') AND id~="' + currentRuleSet + '"';
  return query;
}

function getRuleSetsByTable(tableName, currentRuleSet) {
  var objs = [];
  var query = getRuleSetQuery(tableName, currentRuleSet);

  $("RuleSet").select(query).iterate(function(ruleset) {
    var id = ruleset["id"];
    var caption = scmsg(id, "local:RuleSet");
    if (caption == null) {
      caption = ruleset["name"];
    }

    objs.push({
      value: id,
      disp: caption
    });
  });

  if (objs.length > 0) {
    objs = _.sortBy(objs, "disp");
  }

  return objs;
}

function parseRuleXML(xmlString) {
  var xml = new XML();

  xml.setContent(xmlString);

  var actionType = getElement(xml, "actionType");
  var relationType = getElement(xml, "relationType");
  var ruleset = getElement(xml, "ruleset");
  var action = getElement(xml, "action");
  var filename = getElement(xml, "filename");
  var actionQueryXml = getElement(xml, "actionQueryXml");

  if (actionType != null) {
    actionType = parseInt(actionType.getValue());
  } else {
    // default to related records
    actionType = 1;
  }
  if (relationType != null) {
    relationType = relationType.getValue();
  } else {
    relationType = "";
  }
  if (ruleset != null) {
    ruleset = ruleset.getValue();
  } else {
    ruleset = "";
  }
  if (action != null) {
    action = action.getValue();
  } else {
    // default to save
    action = "1";
  }
  if (filename != null) {
    filename = filename.getValue();
  } else {
    filename = "";
  }
  if (actionQueryXml != null) {
    actionQueryXml = actionQueryXml.getValue();
  } else {
    actionQueryXml = "";
  }

  return {
    actionType: actionType,
    relationType: relationType,
    ruleset: ruleset,
    action: action,
    filename: filename,
    actionQueryXml: actionQueryXml
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
  if (jsonObj.actionType!=null && jsonObj.actionType!="") {
    jsonObj.actionType = parseInt(jsonObj.actionType);
  } else {
    // default to related records
    jsonObj.actionType = 1;
  }

  return jsonObj;
}

var BaseRuleSetOKOnlyWizard = lib.BaseRuleSetOKOnlyWizard.getClass();
var RunActionWizard = $(
        BaseRuleSetOKOnlyWizard,
        {
          actionType: 1,
          relationType: "",
          rulesetName: "",
          action: "1",
          queryFileName: "",
          actionQueryDesc: "",
          actionQueryXml: "",

          queryTable: "",

          // constructor
          init: function init(request) {
            this._super.apply(this, arguments);
            this.actionType = request.getParameter("$L.action.type");
            this.relationType = request.getParameter("$L.relation.type");
            this.rulesetName = request.getParameter("$L.ruleset.name");
            this.action = request.getParameter("$L.btAction");
            this.queryFileName = request.getParameter("$L.query.filename");
            this.actionQueryXml = request.getParameter("$L.query.xml");
            this.actionQueryDesc = request.getParameter("$L.query.desc");
          },

          /**
           * @protected
           */
          getTitle: function getTitle(request) {
            return scmsg(62, "ruleset");
          },

          /**
           * @protected
           */
          getMainTitle: function getMainTitle(request) {
            return scmsg(104, "ruleset");
          },

          /**
           * @protected
           */
          getPrompt: function getPrompt(request) {
            return scmsg("description", msgCls);
          },

          /**
           * @protected
           */
          getSubFormat: function getSubFormat(request) {
            return "RuleSet.runAction";
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
            format["name"] = "wizard-" + this.getSubFormat(request);
            request.setAttribute("$L.format", format);

            request.setAttribute("$L.action.type", this.actionType);
            // get rule set list
            var ruleSetTableName = getRuleSetTableName(this.actionType,
                    this.relationType, this.queryFileName, this.tablename);
            if (this.actionType == 1) {
              // get relation type list
              var relationTypes = getRelationTypeList(this.tablename);
              request.setAttribute("$L.relationTypes", relationTypes.valueList);
              request.setAttribute("$L.relationTypes.local",
                      relationTypes.dispList);
              request.setAttribute("$L.relation.type", this.relationType);
              request.setAttribute("$L.query.table", ruleSetTableName);
            } else if (this.actionType == 2) {
              request.setAttribute("$L.query.filename", ruleSetTableName);
              request.setAttribute("$L.query.table", ruleSetTableName);
            }

            request.setAttribute("$L.ruleset.name", this.rulesetName);

            // get bt action list
            var btActions = getBackendTransitionsByTable(ruleSetTableName,
                    this.actionType);
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
                var allFlows = getWorkflowsByTable(ruleSetTableName);
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

            // setup action query editor
            if (this.actionQueryXml != null) {
              vars["$xmlString2"] = this.actionQueryXml;
            } else {
              vars["$xmlString2"] = '';
            }

            return "runActionWizard.view";
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

            var ruleSetTableName = getRuleSetTableName(this.actionType,
                    this.relationType, this.queryFileName, this.tablename);

            if (_str.isBlank(this.action)) {
              msg(scmsg("require.btAction", msgCls), 3);
              cursor_field_name_set("$L.btAction");
              return false;
            } else {
              var btActions = getBackendTransitionsByTable(ruleSetTableName,
                      this.actionType);
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
              var rulesets = getRuleSetsByTable(ruleSetTableName,
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

            if (this.actionType == 1) {
              if (_str.isBlank(this.relationType)) {
                msg(scmsg("require.relationType", msgCls), 3);
                cursor_field_name_set("$L.relation.type");
                return false;
              } else {
                // get relation type list
                var relationTypes = getRelationTypeList(this.tablename);
                if (!$.contains(relationTypes.valueList, this.relationType)) {
                  msg(scmsg("validate.relationType", msgCls, $
                          .createSCArray(this.relationType)), 3);
                  cursor_field_name_set("$L.relation.type");
                  return false;
                }
              }
            } else if (this.actionType == 2) {
              if (_str.isBlank(this.queryFileName)) {
                msg(scmsg("require.queryTable", msgCls), 3);
                cursor_field_name_set("$L.query.filename");
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
              this.rule["ruleDesc"] = "Run Action";
            }

            if(null==jsonString || ""==jsonString) {
                if (_str.isBlank(xmlString)) {
                  xmlString = "<runAction></runAction>";
                }
                runActionConf = parseRuleXML(xmlString);
            } else {
	            runActionConf = parseRuleJSON(jsonString);
        	}

            this.actionType = runActionConf.actionType;
            this.relationType = runActionConf.relationType;
            this.rulesetName = runActionConf.ruleset;
            this.action = runActionConf.action;
            this.queryFileName = runActionConf.filename;
            this.actionQueryXml = runActionConf.actionQueryXml;

            if (!_str.isBlank(this.actionQueryXml)
                    && null !== this.actionQueryXml
                    && "" !== this.actionQueryXml
                    && "null" !== this.actionQueryXml) {
              this.actionQueryDesc = getDescription(this.actionQueryXml);
              request.setAttribute("$L.query.desc", this.actionQueryDesc);
              request.setAttribute("$L.query.xml", this.actionQueryXml);
            }

            return this.doWizard(request);
          },

          wizard: function wizard(request) {
            return this.doWizard(request);
          },

          ok: function ok(request) {
            if (this.validate(request)) {
              this._super.apply(this, arguments);
              var jsonObj = {};
		      jsonObj.type = "runAction";
		      jsonObj.actionType = "";
		      jsonObj.relationType = "";
		      jsonObj.actionQueryXml = "";
		      jsonObj.ruleset = "";
		      jsonObj.action = "";
		      jsonObj.filename = "";

              if (this.actionType != null) {
                jsonObj.actionType = this.actionType;
              }
              if (this.relationType != null) {
                jsonObj.relationType = this.relationType;
              }
              if (this.rulesetName != null) {
                jsonObj.ruleset = this.rulesetName;
              }
              if (this.action != null) {
                jsonObj.action = this.action;
              }
              if (this.queryFileName != null) {
                jsonObj.filename = this.queryFileName;
              }
              if (this.actionQueryXml != null) {
                jsonObj.actionQueryXml = this.actionQueryXml;
              }

              this.rule["type"] = "runAction";
              this.rule["ruleJSON"] = rteJSONStringify(jsonObj);
              this.rule["ruleXML"] = null;
            } else {
              return this.doWizard(request);
            }
          }
        });

function getClass() {
  return RunActionWizard;
}