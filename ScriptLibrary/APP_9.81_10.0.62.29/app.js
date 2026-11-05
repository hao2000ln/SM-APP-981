function AppBase() {
    this._actions = new Map();
    this._preActions = new Map();
    this._postActions = new Map();
    this._exceptionActions = new Map();

    this._logger = null;
    this._factory = null;
    this._entity = null;
    this._appName = null;
}

AppBase.prototype.getFactory = function getFactory() {
    return this._factory;
};

AppBase.prototype.getLogger = function getLogger() {
    return this.logger;
};

AppBase.prototype.getEntity = function getEntity() {
    return this._entity;
};

AppBase.prototype.getFileName = function getFileName() {
    var fileName = null;
    var entity = this._entity;
    if (entity != null) {
        fileName = entity.getFileName();
    }
    return fileName;
};

AppBase.prototype.getCurrentRecord = function getCurrentRecord() {
    var record = null;
    var entity = this._entity;
    if (entity != null) {
        record = entity.getCurrentRecord();
    }
    return record;
};

AppBase.prototype.getOldRecord = function getOldRecord() {
    var record = null;
    var entity = this._entity;
    if (entity != null) {
        record = entity.getOldRecord();
    }
    return record;
};

AppBase.prototype.init = function init() {
    return this.dispatchAction("app.init");
};

AppBase.prototype.createActionContext = function createActionContext(actionName, params) {
    var actionContext = new lib.action.ActionContext(this, actionName, params);
    return actionContext;
};

AppBase.prototype.dispatchAction = function dispatchAction(actionName, params) {
    var actionContext = this.createActionContext(actionName, params);
    var preAction = this.getPreAction(actionName);
    var action = this.getAction(actionName);
    var postAction = this.getPostAction(actionName);
    var exceptionAction = this.getExceptionAction(actionName);
    var dispatcher = new lib.action.ActionDispatcher(action, preAction, postAction, exceptionAction, actionContext);
    return lib.executor.ScheduleAsyncCall(dispatcher, dispatcher.dispatch, null, this, this._postDispatchAction, actionContext);
};

AppBase.prototype._postDispatchAction = function _postDispatchAction(res, actionContext) {
    return actionContext.getReturnValue();
};

AppBase.prototype.getAction = function getAction(actionName) {
    return this._actions.get(actionName);
};

AppBase.prototype.addActionHandler = function addActionHandler(actionName, handler, head) {
    var action = this._actions.get(actionName);
    if (action == null) {
        action = new lib.action.Action();
        this._actions.set(actionName, action);
    }
    return action.addHandler(handler, head);
};

AppBase.prototype.setEnabledActionHandler = function setEnabledActionHandler(actionName, handler, enabled) {
    var action = this._actions.get(actionName);
    if (action == null) {
        return false;
    }
    return action.setEnabledHandler(handler, enabled);
};

AppBase.prototype.removeActionHandler = function removeActionHandler(actionName, handler) {
    var action = this._actions.get(actionName);
    if (action == null) {
        return false;
    }

    return action.removeHandler(handler);
};

AppBase.prototype.getPreAction = function getPreAction(actionName) {
    return this._preActions.get(actionName);
};

AppBase.prototype.addPreActionHandler = function addPreActionHandler(actionName, handler, head) {
    var action = this._preActions.get(actionName);
    if (action == null) {
        action = new lib.action.Action();
        this._preActions.set(actionName, action);
    }
    return action.addHandler(handler, head);
};

AppBase.prototype.setEnabledPreActionHandler = function setEnabledPreActionHandler(actionName, handler, enabled) {
    var action = this._preActions.get(actionName);
    if (action == null) {
        return false;
    }
    return action.setEnabledHandler(handler, enabled);
};

AppBase.prototype.removePreActionHandler = function removePreActionHandler(actionName, handler) {
    var action = this._preActions.get(actionName);
    if (action == null) {
        return false;
    }

    return action.removeHandler(handler);
};

AppBase.prototype.getPostAction = function getPostAction(actionName) {
    return this._postActions.get(actionName);
};

AppBase.prototype.addPostActionHandler = function addPostActionHandler(actionName, handler, head) {
    var action = this._postActions.get(actionName);
    if (action == null) {
        action = new lib.action.Action();
        this._postActions.set(actionName, action);
    }
    return action.addHandler(handler, head);
};

AppBase.prototype.setEnabledPostActionHandler = function setEnabledPostActionHandler(actionName, handler, enabled) {
    var action = this._postActions.get(actionName);
    if (action == null) {
        return false;
    }
    return action.setEnabledHandler(handler, enabled);
};

AppBase.prototype.removePostActionHandler = function removePostActionHandler(actionName, handler) {
    var action = this._postActions.get(actionName);
    if (action == null) {
        return false;
    }

    return action.removeHandler(handler);
};

AppBase.prototype.getExceptionAction = function getExceptionAction(actionName) {
    return this._exceptionActions.get(actionName);
};

AppBase.prototype.addExceptionActionHandler = function addExceptionActionHandler(actionName, handler, head) {
    var action = this._exceptionActions.get(actionName);
    if (action == null) {
        action = new lib.action.Action();
        this._exceptionActions.set(actionName, action);
    }
    return action.addHandler(handler, head);
};

AppBase.prototype.setEnabledExceptionActionHandler = function setEnabledExceptionActionHandler(actionName, handler, enabled) {
    var action = this._exceptionActions.get(actionName);
    if (action == null) {
        return false;
    }
    return action.setEnabledHandler(handler, enabled);
};

AppBase.prototype.removeExceptionActionHandler = function removeExceptionActionHandler(actionName, handler) {
    var action = this._exceptionActions.get(actionName);
    if (action == null) {
        return false;
    }

    return action.removeHandler(handler);
};