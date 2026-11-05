var $ = lib.c.$;
var type = system.functions.type;

var BaseOKOnlyWizard = lib.BaseOKOnlyWizard.getClass();
var conditionVar = "$xmlString";

var BaseRuleSetOKOnlyWizard = $(BaseOKOnlyWizard, new function() {
  return {
    ruleset: null,
    rule: null,
    tablename: null,
    // constructor
    init: function(request) {
      this._super.apply(this, arguments);

      this.ruleset = request.getParameter("$L.ruleset");
      this.rule = request.getParameter("$L.file");

      if (this.rule["ruleId"] == null) {
        this.rule["ruleId"] = 0;
      }

      this.tablename = this.rule["tablename"];
      if (type(this.tablename) == $.Array) {
        this.tablename = this.tablename[0];
      }

      // setup condition editor
      if (this.rule["conditionXML"] != null) {
        vars[conditionVar] = this.rule["conditionXML"];
      } else {
        vars[conditionVar] = '';
      }
    },

    /**
     * @protected
     */
    setResult: function(request) {
      this._super.apply(this, arguments);
      request.setAttribute("$L.tablename", this.tablename);
    }
  };
});

function getClass() {
  return BaseRuleSetOKOnlyWizard;
}
