var $ = lib.c.$;
var scmsg = system.functions.scmsg;
var CallRad = lib.executor.CallRad;
var parseRuleXML = lib.PopupMessageBoxWizard.parseRuleXML;
var parseRuleJSON = lib.PopupMessageBoxWizard.parseRuleJSON;
var EventHandler = lib.executor.EventHandler;

var PopupMessageBoxExecutor = $({
  popupMessage: "",
  popupType: 0,
  okLevel: 1,
  okType: 1,
  yesnoType: 1,
  yesnocancelType: 1,

  // constructor
  init: function(request) {
    var xmlString = request.getParameter("$L.ruleXML");
    var jsonString = request.getParameter("$L.ruleJSON");
    var popupConf = null;
    if(null==jsonString || ""==jsonString) {
	    var ruleSet = new XML();
	    ruleSet.setContent(xmlString);
	    var parent = ruleSet.getDocumentElement();
	    var rule = parent.getFirstChildElement();
	    popupConf = parseRuleXML(rule.toXMLString());
	} else {
	    popupConf = parseRuleJSON(jsonString);
	}

    this.popupType = popupConf.popupType;
    this.okLevel = popupConf.okLevel;
    this.okType = popupConf.okType;
    this.yesnoType = popupConf.yesnoType;
    this.yesnocancelType = popupConf.yesnocancelType;

    var msgType = popupConf.msgType;
    if (msgType == 1) {
      this.popupMessage = popupConf.popupMessage;
    } else {
      // set record and oldRecord which can be used by message script
      var record = request.getParameter("$L.file");
      var oldRecord = request.getParameter("$L.file.save");
      eval(popupConf.msgScript);
      this.popupMessage = message;
    }
  },

  popup: function(request) {
    var beanName = request.getParameter("$L.js.bean.name");
    request.setAttribute("$L.mb.message", this.popupMessage);
    if (this.popupType == 0) {
      // OK
      request.setAttribute("$L.mb.level", this.okLevel);
      request.setAttribute("$L.mb.ok", beanName + ".doOK");
      return "mb.ok";
    } else {
      request.setAttribute("$L.mb.yes", beanName + ".doYes");
      request.setAttribute("$L.mb.no", beanName + ".doNo");
      if (this.popupType == 1) {
        // yes, no
        request.setAttribute("$L.mb.needCancel", false);
        return "mb.yes.no";
      } else if (this.popupType == 2) {
        // yes, no, cancel
        request.setAttribute("$L.mb.needCancel", true);
        request.setAttribute("$L.mb.cancel", beanName + ".doCancel");
        return "mb.yes.no";
      }
    }
  },

  doOK: function(request) {
    if (this.okType == 1) {
      request.setAttribute("$L.result", 0);
    } else {
      request.setAttribute("$L.result", 1);
    }
  },

  doYes: function(request) {
    if (this.popupType == 1) {
      if (this.yesnoType == 0) {
        request.setAttribute("$L.result", 0);
        request.setAttribute("$L.wfAnswer", "Yes");
      } else if (this.yesnoType == 1) {
        request.setAttribute("$L.result", 0);
      } else if (this.yesnoType == 2) {
        request.setAttribute("$L.result", 1);
      }
    } else if (this.popupType == 2) {
      request.setAttribute("$L.result", 0);
      request.setAttribute("$L.wfAnswer", "Yes");
    }
  },

  doNo: function(request) {
    if (this.popupType == 1) {
      if (this.yesnoType == 0) {
        request.setAttribute("$L.result", 0);
        request.setAttribute("$L.wfAnswer", "No");
      } else if (this.yesnoType == 1) {
        request.setAttribute("$L.result", 1);
      } else if (this.yesnoType == 2) {
        request.setAttribute("$L.result", 0);
      }
    } else if (this.popupType == 2) {
      request.setAttribute("$L.result", 0);
      request.setAttribute("$L.wfAnswer", "No");
    }
  },

  doCancel: function(request) {
    if (this.yesnocancelType == 0) {
      request.setAttribute("$L.result", 0);
      request.setAttribute("$L.wfAnswer", "Cancel");
    } else if (this.yesnocancelType == 1) {
      request.setAttribute("$L.result", 1);
    }
  }

});

function getClass() {
  return PopupMessageBoxExecutor;
}