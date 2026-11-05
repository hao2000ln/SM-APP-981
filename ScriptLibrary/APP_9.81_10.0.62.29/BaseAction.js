var $ = lib.c.$;

var AppStart = lib.executor.AppStart;
var AppStop = lib.executor.AppStop;
var ScheduleAsyncCall = lib.executor.ScheduleAsyncCall;
var GetCurrentApp = lib.executor.GetCurrentApp;
var AppDispatchAction = lib.executor.AppDispatchAction;
var EventHandler = lib.executor.EventHandler;

/**
 * @class BaseAction
 * @classdesc The abstract action class for invoking action
 */
var BaseAction = $(new function() {
  return {
    /**
     * Start action
     * 
     * @private
     */
    doStart: function doStart() {
      AppStart(this.getName());
    },

    /**
     * Do action
     * 
     * @private
     */
    doAction: function doAction(res, params) {
      var app = GetCurrentApp();
      var actionName = this.getName();
      var handlers = this.getHandlers();
      for (var i = 0; i < handlers.length; i++) {
        app.addActionHandler(actionName, new EventHandler(this, handlers[i]));
      }
      app.addExceptionActionHandler(actionName, new EventHandler(this,
              this.handleException));

      ScheduleAsyncCall(null, AppDispatchAction, [actionName, params], this,
              this.doStop, null);
    },

    /**
     * Stop action
     * 
     * @private
     */
    doStop: function doStop(res) {
      AppStop(this.getName());
      return res;
    },

    /**
     * Get action name
     * 
     * @protected
     */
    getName: function getName() {
    },

    /**
     * Get action handlers
     * 
     * @protected
     */
    getHandlers: function getHandlers() {
    },

    /**
     * handle exception
     * 
     * @protected
     */
    handleException: function handleException(exception) {

    },

    /**
     * Invoke an action with the given parameters
     * 
     * @public
     * @param params -
     *          parameters passed to action
     */
    invokeAction: function invokeAction(params) {
      ScheduleAsyncCall(this, this.doStart, null, this, this.doAction, params);
    }
  /* #testAction */
  };
});

function getClass() {
  return BaseAction;
}