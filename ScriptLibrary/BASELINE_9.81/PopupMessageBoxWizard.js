var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;
var msg = funcs.msg;
var scmsg = funcs.scmsg;
var cursor_field_name_set = funcs.cursor_field_name_set;
var getElement = lib.xmlHelpers.getElement;
var CallRad = lib.executor.CallRad;
var EventHandler = lib.executor.EventHandler;

var msgClass = "local:popupMsgBox";

function getDefaultOKType(level) {
  if (level == 1) {
    // default to Continue for info
    return 1;
  } else {
    // default to Stop for warn/error
    return 2;
  }
}

function parseRuleXML(xmlString) {
  var xml = new XML();
  xml.setContent(xmlString);
  var msgType = 1;
  var msgScript = "";
  var popupMessage = getElement(xml, "popupMessage");
  var popupType = getElement(xml, "popupType");
  var okLevel = getElement(xml, "okLevel");
  var okType = getElement(xml, "okType");
  var yesnoType = getElement(xml, "yesnoType");
  var yesnocancelType = getElement(xml, "yesnocancelType");

  if (popupMessage != null) {
    var messageNumber = getElement(popupMessage, "messageNumber");
    var messageScript = getElement(popupMessage, "messageScript");
    if (messageNumber != null) {
      popupMessage = scmsg(messageNumber.getValue(), msgClass);
    } else if (messageScript != null) {
      msgType = 2;
      msgScript = messageScript.getValue();
      popupMessage = "";
    } else {
      popupMessage = popupMessage.getValue();
    }
  } else {
    popupMessage = "";
  }
  if (popupType != null) {
    popupType = parseInt(popupType.getValue());
  } else {
    // default to OK
    popupType = 0;
  }
  if (okLevel != null) {
    okLevel = parseInt(okLevel.getValue());
  } else {
    // default to info
    okLevel = 1;
  }
  if (okType != null) {
    okType = parseInt(okType.getValue());
  } else {
    okType = getDefaultOKType(okLevel);
  }

  if (yesnoType != null) {
    yesnoType = parseInt(yesnoType.getValue());
  } else {
    // default to Yes=Continue,No=Stop
    yesnoType = 1;
  }

  if (yesnocancelType != null) {
    yesnocancelType = parseInt(yesnocancelType.getValue());
  } else {
    // default to Cancel=Stop
    yesnocancelType = 1;
  }

  return {
    msgType: msgType,
    msgScript: msgScript,
    popupMessage: popupMessage,
    popupType: popupType,
    okLevel: okLevel,
    okType: okType,
    yesnoType: yesnoType,
    yesnocancelType: yesnocancelType
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
  jsonObj.msgType = 1;
  if(jsonObj.messageNumber!=null && jsonObj.messageNumber!="") {
      jsonObj.popupMessage = scmsg(jsonObj.messageNumber, msgClass);
  } else if (jsonObj.messageScript!=null && jsonObj.messageScript!="") {
      jsonObj.msgType = 2;
      jsonObj.msgScript = jsonObj.messageScript;
      jsonObj.popupMessage = "";
  }

    jsonObj.popupType = jsonObj.popupType == null ? 0 : jsonObj.popupType;

    jsonObj.okLevel = jsonObj.okLevel == null ? 1 : jsonObj.okLevel;

    jsonObj.okType = jsonObj.okType == null ? getDefaultOKType(jsonObj.okLevel) : jsonObj.okType;

    jsonObj.yesnoType = jsonObj.yesnoType == null ? 1 : jsonObj.yesnoType;

    jsonObj.yesnocancelType = jsonObj.yesnocancelType == null ? 1 : jsonObj.yesnocancelType;

  return jsonObj;
}

var BaseRuleSetOKOnlyWizard = lib.BaseRuleSetOKOnlyWizard.getClass();
var PopupMessageBoxWizard = $(BaseRuleSetOKOnlyWizard, {
  msgType: 1,
  msgScript: "",
  popupMessage: "",
  popupType: 0,
  okLevel: 1,
  okType: 1,
  yesnoType: 1,
  yesnocancelType: 1,

  // constructor
  init: function(request) {
    this._super.apply(this, arguments);
    this.msgType = request.getParameter("$L.msg.type");
    this.msgScript = request.getParameter("$L.msg.script");
    this.popupMessage = request.getParameter("$L.popup.message");
    this.popupType = request.getParameter("$L.popup.type");
    this.okLevel = request.getParameter("$L.ok.level");
    this.okType = request.getParameter("$L.ok.type");
    this.yesnoType = request.getParameter("$L.yesno.type");
    this.yesnocancelType = request.getParameter("$L.yesnocancel.type");
  },

  /**
   * @protected
   */
  getMessageNumber: function(request) {
    return this.ruleset["id"] + ";" + this.rule["ruleId"];
  },

  /**
   * @protected
   */
  getTitle: function(request) {
    return scmsg(61, "ruleset");
  },

  /**
   * @protected
   */
  getMainTitle: function(request) {
    return scmsg(61, "ruleset");
  },

  /**
   * @protected
   */
  getPrompt: function(request) {
    return scmsg(109, "ruleset");
  },

  /**
   * @protected
   */
  getSubFormat: function(request) {
    return "RuleSet.popupMessageBox";
  },

  /**
   * @protected
   */
  setResult: function(request) {
    this._super.apply(this, arguments);
    request.setAttribute("$L.msg.type", this.msgType);
    request.setAttribute("$L.msg.script", this.msgScript);
    request.setAttribute("$L.popup.message", this.popupMessage);
    request.setAttribute("$L.popup.type", this.popupType);
    request.setAttribute("$L.ok.level", this.okLevel);
    request.setAttribute("$L.ok.type", this.okType);
    request.setAttribute("$L.yesno.type", this.yesnoType);
    request.setAttribute("$L.yesnocancel.type", this.yesnocancelType);
  },

  /**
   * @protected
   */
  validate: function(request) {
    if (_str.isBlank(this.rule["ruleDesc"])) {
      msg(scmsg(2103, "fc"), 3);
      cursor_field_name_set("ruleDesc");
      return false;
    }

    if (this.msgType == 1) {
      if (_str.isBlank(this.popupMessage)) {
        msg(scmsg("validate.message", msgClass), 3);
        cursor_field_name_set("$L.popup.message");
        return false;
      }
    } else {
      if (_str.isBlank(this.msgScript)) {
        msg(scmsg("validate.script", msgClass), 3);
        cursor_field_name_set("$L.msg.script");
        return false;
      }
    }

    return true;
  },

  /**
   * @protected
   */
  doWizard: function(request) {
    this._super.apply(this, arguments);
    return "popupMessageBoxWizard.view";
  },

  showWizard: function(request) {
    var xmlString = this.rule["ruleXML"];
    var jsonString = this.rule["ruleJSON"];
    var popupConf = null;

    if (_str.isBlank(this.rule["ruleDesc"])) {
      this.rule["ruleDesc"] = "Message Box : <Message>";
    }

    if(null==jsonString || ""==jsonString) {
	    if (_str.isBlank(xmlString)) {
          xmlString = "<popupMessageBox></popupMessageBox>";
        }

	    popupConf = parseRuleXML(xmlString);
	} else {
	    popupConf = parseRuleJSON(jsonString);
	}

    this.msgType = popupConf.msgType;
    this.msgScript = popupConf.msgScript;
    this.popupMessage = popupConf.popupMessage;
    this.popupType = popupConf.popupType;
    this.okLevel = popupConf.okLevel;
    this.okType = popupConf.okType;
    this.yesnoType = popupConf.yesnoType;
    this.yesnocancelType = popupConf.yesnocancelType;
    return this.doWizard(request);
  },

  wizard: function(request) {
    return this.doWizard(request);
  },

  ok: function(request) {
    if (this.validate(request)) {
      this._super.apply(this, arguments);

      var msgDesc = this.popupMessage;
      
      var jsonObj = {};
      jsonObj.type = "popupMessageBox";
      jsonObj.popupMessage = "";
      jsonObj.popupType = "";
      jsonObj.okLevel = "";
      jsonObj.okType = "";
      jsonObj.yesnoType = "";
      jsonObj.yesnocancelType = "";
      jsonObj.messageNumber = "";
      jsonObj.messageScript = "";

      if (this.msgType == 1) {
        if (this.rule["ruleId"] == 0) {
          jsonObj.popupMessage = this.popupMessage;
        } else {
          // check if the localizedMessage exists
          var messageNumber = this.getMessageNumber(request);
          var query = 'syslanguage~="xxx" and class="' + msgClass
                  + '" and message.id="' + messageNumber + '"';
          var message = $("scmessage").select(query).uniqueResult();
          if (message != null) {
            //jsonObj.msgNumber = messageNumber;
            jsonObj.messageNumber = messageNumber;
            msgDesc = 'scmsg("' + messageNumber + '","' + msgClass + '")';
          } else {
            jsonObj.popupMessage = this.popupMessage;
          }
        }
      } else {
        // set message script
        jsonObj.messageScript = this.msgScript;
        msgDesc = 'eval script';
      }

      // replace <Message> with the real message
      if (_str.endsWith(this.rule["ruleDesc"], "<Message>")) {
        this.rule["ruleDesc"] = this.rule["ruleDesc"].replace("<Message>",
                msgDesc);
      }

      jsonObj.popupType = this.popupType;
      jsonObj.okLevel = this.okLevel;
      jsonObj.okType = this.okType;
      jsonObj.yesnoType = this.yesnoType;
      jsonObj.yesnocancelType = this.yesnocancelType;
      
      this.rule["type"] = "popupMessageBox";
      this.rule["ruleJSON"] = rteJSONStringify(jsonObj);
      this.rule["ruleXML"] = null;
    } else {
      return this.doWizard(request);
    }
  },

  editMessage: function(request) {
    // do asynchronous call for RAD "se.search.engine"
    var handlers = request.handlers;
    handlers.push(this.callSearchEngine);
    handlers.push(this.callbackForEditMessage);
  },

  /**
   * @protected
   */
  callSearchEngine: function(request) {
    var messageNumber = this.getMessageNumber(request);
    var query = 'syslanguage~="xxx" and class="' + msgClass
            + '" and message.id="' + messageNumber + '"';
    var message = $("scmessage").select(query).uniqueResult();
    if (message == null) {
      message = new SCFile("scmessage");
      message["syslanguage"] = system.sysinfo.languagecode;
      message["message.id"] = messageNumber;
      message["class"] = msgClass;
      message["message"] = this.popupMessage;
      message.doInsert();
    }

    CallRad("se.search.engine", ["name", "query", "prompt"], [
        "localizedMessage.edit", query, "exit"]);
  },

  /**
   * @protected
   */
  callbackForEditMessage: function(request) {
    var messageNumber = this.getMessageNumber(request);
    var query = 'syslanguage~="xxx" and class="' + msgClass
            + '" and message.id="' + messageNumber + '"';
    var message = $("scmessage").select(query).uniqueResult();
    this.popupMessage = message["message"];
    return this.doWizard(request);
  },

  changeOKLevel: function(request) {
    this.okType = getDefaultOKType(this.okLevel);
    return this.doWizard(request);
  }
});

function getClass() {
  return PopupMessageBoxWizard;
}
