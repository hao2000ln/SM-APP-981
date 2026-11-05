function ActionDispatchContext(action) {
    this.action = action;
    this.currentPos = 0;
    this.cancelled = false;
    this.stopped = false;
}


function Action() {
    this._handlers = new lib.executor.EventHandlers();
    this._length = 0;
}


Action.prototype.handlerCount = function handlerCount() {
    return this._handlers.length;
};

Action.prototype.addHandler = function addHandler(handler, head) {
    this._handlers.addHandler(handler, head);
    this.length = this._handlers.length;
    return true;
};

Action.prototype.setEnabledHandler = function setEnabledHandler(handler, enabled) {
    return this._handlers.setEnabledHandler(handler, enabled);
};

Action.prototype.removeHandler = function removeHandler(handler) {
    this._handlers.removeHandler(handler);
    this.length = this._handlers.length;
    return true;
};

Action.prototype.dispatch = function dispatch(actionContext) {
    if (this._handlers.length == 0) {
        return 0;
    }

    var context = new ActionDispatchContext(this);
    actionContext._dispContext = context;
    return this._onDispatchNext(Action.CONTINUE, actionContext);
};

Action.prototype._getNextHandler = function _getNextHandler(context) {
    var currentPos = context.currentPos;
    var handlers = this._handlers;
    var length = handlers.length;
    if (currentPos >= length) {
        return null;
    }

    var handler = null;
    while (currentPos < length) {
        handler = handlers[currentPos];
        if (handler.getEnabled()) {
            currentPos++;
            break;
        }
        currentPos++;
    }

    context.currentPos = currentPos;
    return handler;
};

Action.prototype._onDispatchNext = function _onDispatchNext(res, actionContext) {
    var dispContext = actionContext._dispContext;
    if (dispContext == null || dispContext.action != this) {
        throw "Action dispatch error, context was changed surprisingly.";
    }

    if (dispContext.cancelled) {
        return dispContext.dispRes;
    }

    var handler = this._getNextHandler(dispContext);
    if (handler == null) {
        return res;
    }

    return lib.executor.ScheduleAsyncCall(handler, handler.dispatch, [actionContext], this, this._onDispatchNext, actionContext);
};


function ActionContext(app, actionName, params) {
    this._values = new Map();
    this.app = app;
    this._actionName = actionName;
    this._res = null;
    this._dispContext = null;
    this.params = params;
    this.exception = null;
}

ActionContext.prototype.getParameter = function getParameter(name) {
    return this.params[name];
};

ActionContext.prototype.setParameter = function setParameter(name, value) {
    this.params[name] = value;
};


ActionContext.prototype.getProperty = function getProperty(name) {
    return this._values.get(name);
};

ActionContext.prototype.setProperty = function setProperty(name, value) {
    this._values.set(name, value);
};

ActionContext.prototype.getReturnValue = function getReturnValue() {
    return this._res;
};

ActionContext.prototype.setReturnValue = function setReturnValue(res) {
    this._res = res;
};

ActionContext.prototype.getApp = function getApp() {
    return this.app;
};

ActionContext.prototype.getActionName = function getActionName() {
    return this._actionName;
};

ActionContext.prototype.getFileName = function getFileName() {
    if (this.app != null) {
        return this.app.getFileName();
    }
    return null;
};

ActionContext.prototype.getEntity = function getEntity() {
    if (this.app != null) {
        return this.app.getEntity();
    }
    return null;
};

ActionContext.prototype.getCurrentRecord = function getCurrentRecord() {
    if (this.app != null) {
        return this.app.getCurrentRecord();
    }
    return null;
};

ActionContext.prototype.getOldRecord = function getOldRecord() {
    if (this.app != null) {
        return this.app.getOldRecord();
    }
    return null;
};

ActionContext.prototype.breakAction = function breakAction(res, cancelled) {
    this._res = res;
    if (this._dispContext != null) {
        this._dispContext.cancelled = Boolean(cancelled);
        this._dispContext.stopped = true;
    }
    return true;
};

ActionContext.prototype.resetAction = function resetAction() {
    if (this._dispContext != null) {
        this._dispContext.cancelled = false;
        this._dispContext.stopped = false;
    }
    return true;
};

ActionContext.prototype.cancelled = function cancelled() {
    if (this._dispContext == null) {
        return false;
    }

    return this._dispContext.cancelled;
};

ActionContext.prototype.stopped = function stopped() {
    if (this._dispContext == null) {
        return false;
    }

    return this._dispContext.stopped;
};


function ActionDispatcher(action, actionPre, actionPost, actionOnExcpt, actionContext) {
    this._action = action;
    this._actionPre = actionPre;
    this._actionPost = actionPost;
    this._actionOnExcpt = actionOnExcpt;
    this._actionContext = actionContext;
}


ActionDispatcher.prototype.dispatch = function dispatch() {
    return this._dispPre();
};

ActionDispatcher.prototype._dispPre = function _dispPre() {
    var action = this._actionPre;
    if (action == null || action.length == 0) {
        return this._dispAction(0);
    }

    return lib.executor.ScheduleAsyncCall(action, action.dispatch, [this._actionContext], this, this._dispAction, null, this, this._dispExcpt);
};

ActionDispatcher.prototype._dispAction = function _dispAction(res) {
    var actionContext = this._actionContext;

    if (actionContext.stopped()) {
        if (actionContext.cancelled()) {
            return res;
        }

        return this._dispPost(res);
    }

    var action = this._action;
    if (action == null || action.length == 0) {
        return this._dispPost(res);
    }

    return lib.executor.ScheduleAsyncCall(action, action.dispatch, [this._actionContext], this, this._dispPost, null, this, this._dispExcpt);
};

ActionDispatcher.prototype._dispPost = function _dispPost(res) {
    var action = this._actionPost;

    if (action == null || action.length == 0) {
        return res;
    }

    return action.dispatch(this._actionContext);
};

ActionDispatcher.prototype._dispExcpt = function _dispExcpt(exception) {
    var action = this._actionOnExcpt;

    if (action == null || action.length == 0) {
        throw exception;
    }

    this._actionContext.exception = exception;
    return lib.executor.ScheduleAsyncCall(action, action.dispatch, [this._actionContext], this, this._postExcpt);
};

ActionDispatcher.prototype._postExcpt = function _postExcpt(res) {
    throw this._actionContext.exception;
};