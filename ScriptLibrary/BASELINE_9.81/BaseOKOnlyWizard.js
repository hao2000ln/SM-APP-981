var $ = lib.c.$;
var cleanup = system.functions.cleanup;
var scmsg = system.functions.scmsg;

var exitVar = "$L.wiz.exit";

var BaseOKOnlyWizard = $(new function() {
  return {
    // constructor
    init: function(request) {
      cleanup(vars[exitVar]);
    },

    /**
     * @protected
     */
    getTitle: function(request) {
    },

    /**
     * @protected
     */
    getMainTitle: function(request) {
    },

    /**
     * @protected
     */
    getPrompt: function(request) {
    },

    /**
     * @protected
     */
    getSubFormat: function(request) {

    },

    /**
     * @protected
     */
    getBitmap: function(request) {
      return "wizard1";
    },

    /**
     * @protected
     */
    needPromptOnCancel: function(request) {
      return vars["$G.prompt.for.save"];
    },

    /**
     * @protected
     */
    setResult: function(request) {
      request.setAttribute("$L.title", this.getTitle(request));
      request.setAttribute("$L.main.title", this.getMainTitle(request));
      request.setAttribute("$L.prompt", this.getPrompt(request));
      request.setAttribute("$L.subformat", this.getSubFormat(request));
      request.setAttribute("$L.bitmap", this.getBitmap(request));
    },

    /**
     * @protected
     */
    doWizard: function(request) {
      // show the wizard page
      this.setResult(request);
    },

    /**
     * @protected
     */
    doExit: function(request) {
      // do before exit
    },

    cancel: function(request) {
      if (this.needPromptOnCancel(request)) {
        // set view variable in mb.yes.no
        request.setAttribute("$L.mb.message", system.functions.scmsg(13,
                "wizard"));
        request.setAttribute("$L.mb.needCancel", false);
        var beanName = request.getParameter("$L.js.bean.name");

        // configure the button on this view
        request.setAttribute("$L.mb.yes", beanName + ".doCancelYes");
        request.setAttribute("$L.mb.no", beanName + ".doCancelNo");
        return "mb.yes.no";
      } else {
        request.setAttribute(exitVar, "cancel");
        this.doExit(request);
      }
    },

    ok: function(request) {
      request.setAttribute(exitVar, "normal");
      this.doExit(request);
    },

    doCancelYes: function(request) {
      request.setAttribute(exitVar, "cancel");
      this.doExit(request);
    },

    doCancelNo: function(request) {
      return this.doWizard(request);
    }

  };
});

function getClass() {
  return BaseOKOnlyWizard;
}