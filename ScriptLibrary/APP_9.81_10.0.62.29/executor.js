var rteLogger = getLog("executor");


function EventHandler(handlerObj, handlerFunc, context) {
    this._handlerObj = handlerObj;
    this._handlerFunc = handlerFunc;
    this._context = context;
    this._enabled = true;
}


EventHandler.prototype.dispatch = function dispatch(params) {
    var func = this._handlerFunc;
    if (func == null || !this._enabled) {
        return 0;
    }

    if (func.name) {
        TraceInfo("EventHandler.dispatch funName: " + func.name);
    }

    var context = this._context;
    var calleeObj = this._handlerObj;

    if (params == null) {
        return func.call(calleeObj, context);
    }
    if (!(params instanceof Array)) {
        return func.call(calleeObj, params, context);
    }

    var nParams = params.length;

    switch (nParams) {
        case 0:
            return func.call(calleeObj, context);
        case 1:
            return func.call(calleeObj, params[0], context);
        case 2:
            return func.call(calleeObj, params[0], params[1], context);
        case 3:
            return func.call(calleeObj, params[0], params[1], params[2], context);
        case 4:
            return func.call(calleeObj, params[0], params[1], params[2], params[3], context);
    }

    if (context == null) {
        return this._handlerFunc.apply(calleeObj, params);
    }

    var tempParams = params.concat([context]);
    return this._handlerFunc.apply(calleeObj, tempParams);
};

EventHandler.prototype.clone = function clone() {
    return new EventHandler(this._handlerObj, this._handlerFunc, this._context);
};

EventHandler.prototype.getEnabled = function getEnabled() {
    return this._enabled;
};

EventHandler.prototype.setEnabled = function setEnabled(enabled) {
    var res = this._enabled;
    this._enabled = Boolean(enabled);
    return res;
};

function IsEqualEventHandler(first, second) {
    var res = (first._handlerObj == second._handlerObj && first._handlerFunc == second._handlerFunc);
    return res;
}


function EventHandlers() {
    Array.call(this);
}

EventHandlers.prototype = [];

EventHandlers.prototype.indexOf = function indexOf(handler) {
    var length = this.length;
    var i;
    for (i = 0; i < length; i++) {
        var thisValue = this[i];
        if (IsEqualEventHandler(thisValue, handler)) {
            break;
        }
    }
    if (i == length) {
        i = -1;
    }

    return i;
};

EventHandlers.prototype.addHandler = function addHandler(handler, head) {
    var index = this.indexOf(handler);

    if (head == true) {
        this.unshift(handler);
    } else {
        this.push(handler);
    }

    return true;
};

EventHandlers.prototype.setEnabledHandler = function setEnabledHandler(handler, enabled) {
    var index = this.indexOf(handler);
    if (index == -1) {
        return false;
    }

    handler = this[index];

    return handler.setEnabled(enabled);
};

EventHandlers.prototype.removeHandler = function removeHandler(handler) {
    var index = this.indexOf(handler);
    if (index == -1) {
        return false;
    }

    this.splice(index, 1);

    return true;
};


var tls = null;

function GetTLS() {
    return tls;
}

function GetTLSValue(name) {
    return tls.get(name);
}

function SetTLSValue(name, value) {
    return tls.set(name, value);
}

function RemoveTLSValue(name) {
    return tls.delete(name);
}

function _jsExecuteEnterProxy(context, thread, calleeObj, func, params) {
    var tlsSave = tls;
    if (typeof thread.tls == 'undefined') {
        thread.tls = new Map();
    }
    tls = thread.tls;
    context.tls = tls;
    context.executor = new AsyncExecutor();
    var res = context.executor._execute(calleeObj, func, params);
    tls = tlsSave;
    return res;
}

function _jsExecuteSuspendProxy(context) {
    return context.executor._suspend();
}

function _jsExecuteResumeProxy(context) {
    var tlsSave = tls;
    tls = context.tls;
    var res = context.executor._resume();
    tls = tlsSave;
    return res;
}

function AsyncExecutor() {
    this._currentObject = null;
    this._nextObjects = [];
    this._result = 0;
    this._suspended = false;
    this._SavedExecutor = null;
    this._evRadApp = false;
    this._callingHandler = false;
    this._exceptHandling = false;
}


AsyncExecutor.CurrentExecutor = null;

AsyncExecutor.prototype.ScheduleAsyncCall = function ScheduleAsyncCall(calleeObj, func, params, onReturn, onException) {
    var obj = {};
    obj.calleeObj = calleeObj;
    obj.func = func;
    obj.params = params;

    if (onReturn != null && onReturn._handlerFunc != null) {
        obj.onReturn = onReturn;
    } else {
        obj.onReturn = null;
    }

    if (onException != null && onException._handlerFunc != null) {
        obj.onException = onException;
    } else {
        obj.onException = null;
    }

    this._nextObjects.push(obj);

    return null;
};

AsyncExecutor.prototype._execute = function _execute(obj, func, params) {
    this._SavedExecutor = AsyncExecutor.CurrentExecutor;
    AsyncExecutor.CurrentExecutor = this;
    this.ScheduleAsyncCall(obj, func, params, null);
    var res = this._run();
    AsyncExecutor.CurrentExecutor = this._SavedExecutor;
    return res;
};

AsyncExecutor.prototype._suspend = function _suspend() {
    this._suspended = true;
    return true;
};

AsyncExecutor.prototype._resume = function _resume() {
    this._SavedExecutor = AsyncExecutor.CurrentExecutor;
    AsyncExecutor.CurrentExecutor = this;
    this._suspended = false;
    var res = this._run();
    AsyncExecutor.CurrentExecutor = this._SavedExecutor;
    return res;
};

AsyncExecutor.prototype._run = function _run() {
    this._callingHandler = false;
    this._exceptHandling = false;
    var exception = null;
    while (true) {
        try {
            while (true) {
                if (this._suspended) {
                    this._result = null;
                    break;
                }

                if (this._nextObjects.length > 0) {
                    var nextObject = this._nextObjects.shift();
                    nextObject.parent = this._currentObject;
                    this._currentObject = nextObject;
                    this._callingHandler = false;
                    this._result = this._doCall();
                    continue;
                }

                if (this._currentObject == null) {
                    break;
                }

                if (this._exceptHandling) {
                    var onException = this._currentObject.onException;
                    if (onException != null) {
                        this._result = onException._handlerFunc.call(onException._handlerObj, exception, onException._context);
                        this._exceptHandling = false;
                    }
                } else {
                    var onReturn = this._currentObject.onReturn;
                    if (onReturn != null) {
                        this._callingHandler = true;
                        this._result = onReturn._handlerFunc.call(onReturn._handlerObj, this._result, onReturn._context);
                        this._callingHandler = false;
                    }
                }

                this._currentObject = this._currentObject.parent;
            } //end for(;;)
        } catch (err) {
            exception = err;
            this._result = -1;
            if (this._callingHandler || this._exceptHandling) {
                if (this._currentObject == null) {
                    break;
                }
                this._currentObject = this._currentObject.parent;
            } else {
                this._exceptHandling = true;
            }
            continue;
        }
        break;
    } //end for(;;)
    if (this._exceptHandling) {
        TraceException("AsyncExecutor ", exception);
        throw exception;
    }
    TraceReturnValue("AsyncExecutor", this._result);
    return this._result;
};


AsyncExecutor.prototype.traceCallStack = function traceCallStack() {
    var currentObj = this._currentObject;
    var obj;
    var func;

    if (this._callingHandler) {
        var onReturn = currentObj.onReturn;
        if (onReturn != null) {
            obj = onReturn._handlerObj;
            if (obj == null) {
                obj = "null";
            } else {
                obj = obj.constructor.name;
            }

            func = onReturn._handlerFunc;
            if (func == null) {
                func = "null";
            } else {
                func = func.name;
            }

            TraceInfo("calling onReturn object: " + obj + " function: " + func);
        }
        currentObj = currentObj.parent;
    }

    while (currentObj != null) {
        obj = currentObj.calleeObj;
        if (obj == null) {
            obj = "null";
        } else {
            obj = obj.constructor.name;
        }

        func = currentObj.func;
        if (func == null) {
            func = "null";
        } else {
            func = func.name;
        }

        TraceInfo("calling object: " + obj + " function: " + func);

        currentObj = currentObj.parent;
    }
};

AsyncExecutor.prototype._doCall = function _doCall() {
    var params = this._currentObject.params;
    var func = this._currentObject.func;
    var calleeObj = this._currentObject.calleeObj;

    if (func == null) {
        return this._result;
    }

    if (params == null) {
        return func.call(calleeObj);
    }

    if (!(params instanceof Array)) {
        return func.call(calleeObj, params);
    }

    var nParams = params.length;

    switch (nParams) {
        case 0:
            return func.call(calleeObj);
        case 1:
            return func.call(calleeObj, params[0]);
        case 2:
            return func.call(calleeObj, params[0], params[1]);
        case 3:
            return func.call(calleeObj, params[0], params[1], params[2]);
        case 4:
            return func.call(calleeObj, params[0], params[1], params[2], params[3]);
    }
    return func.apply(calleeObj, params);
};

AsyncExecutor.prototype._Suspend = function _Suspend(reason) {
    this._suspendReason = reason;
};

function GetAsyncExecutor() {
    return AsyncExecutor.CurrentExecutor;
}

function ScheduleAsyncCall(calleeObj, func, params, onReturnObj, onReturnFunc, onReturnContext, onXcptObj, onXcptFunc, onXcptContext) {
    return GetAsyncExecutor().ScheduleAsyncCall(calleeObj, func, params, new EventHandler(onReturnObj, onReturnFunc, onReturnContext), new EventHandler(onXcptObj, onXcptFunc, onXcptContext));
}

function ScheduleAsyncCall2(calleeObj, func, params, onReturn, onException) {
    return GetAsyncExecutor().ScheduleAsyncCall(calleeObj, func, params, onReturn, onException);
}

function _doCallRad(radName, names, values, fromGUI) {
    return callrad(radName, names, values, fromGUI);
}

function CallRad(radName, names, values, onReturn, onException) {
    return ScheduleAsyncCall2(null, _doCallRad, [radName, names, values, true], onReturn, onException);
}

function CallRadWithBackend(radName, names, values, onReturn, onException) {
    return ScheduleAsyncCall2(null, _doCallRad, [radName, names, values, false], onReturn, onException);
}

function JsThread(obj, func, params) {
    return beginThread(obj, func, params);
}


function FactoryInfo(factoryLibrary, factoryObjName) {
    this.factoryLibrary = factoryLibrary;
    this.factoryObjName = factoryObjName;
    this.factoryObj = null;
}


function FactoryManager() {}

FactoryManager.factoryMap = new Map();

FactoryManager.prototype.register = function register(appName, factoryLibrary, factoryObjName) {
    var map = FactoryManager.factoryMap;
    var oldFactoryInfo = map.get(appName);
    map.set(appName, new FactoryInfo(factoryLibrary, factoryObjName));
    return oldFactoryInfo;
};

FactoryManager.prototype.unregister = function unregister(appName) {
    FactoryManager.factoryMap.delete(appName);
    return 0;
};

FactoryManager.prototype.getFactory = function getFactory(appName) {
    var factoryInfo = FactoryManager.factoryMap.get(appName);
    if (factoryInfo == null) {
        return new lib.factory.FactoryBase(appName);
    }

    var factory = factoryInfo.factoryObj;
    if (factory == null) {
        factory = new lib[factoryInfo.factoryLibrary][factoryInfo.factoryObjName](appName);
        factoryInfo.factoryObj = factory;
    }

    return factory;
};


var factoryManager = new FactoryManager();


function AppStart(appName) {
    var factory = factoryManager.getFactory(appName);
    var loader = factory.createAppLoader();
    var app = loader.LoadApp(appName, factory);
    return ScheduleAsyncCall(app, app.init, null, null, _postAppStart, app);
}

function AppStop(appName) {
    RemoveCurrentApp();
    return 0;
}

function AppDispatchAction(actionName, params) {
    var app = GetCurrentApp();
    return app.dispatchAction(actionName, params);
}

function GetCurrentApp() {
    var apps = GetTLSValue("_running.apps");
    if (apps == null || apps.length == 0) {
        throw "Try to get current app failed.";
    }

    return apps[apps.length - 1];
}

function SetCurrentApp(app) {
    var apps = GetTLSValue("_running.apps");
    if (apps == null) {
        apps = [app];
        SetTLSValue("_running.apps", apps);
    } else {
        apps.push(app);
    }
}

function RemoveCurrentApp() {
    var apps = GetTLSValue("_running.apps");
    if (apps == null || apps.length == 0) {
        throw "Try to remove current app failed.";
    } else {
        apps.pop();
    }
}

function _postAppStart(res, app) {
    SetCurrentApp(app);
    return 0;
}


function TraceConfig() {}

TraceConfig._TraceParam = false;
TraceConfig._TraceReturnValue = false;
TraceConfig._TraceInfo = true;
TraceConfig._TraceException = true;

TraceConfig.prototype.IsTraceParamEnabled = function IsTraceParamEnabled() {
    return TraceConfig._TraceParam;
};

TraceConfig.prototype.IsTraceReturnValueEnabled = function IsTraceReturnValueEnabled() {
    return TraceConfig._TraceReturnValue;
};


TraceConfig.prototype.IsTraceExceptionEnabled = function IsTraceExceptionEnabled() {
    return TraceConfig._TraceException;
};

TraceConfig.prototype.IsTraceInfoEnabled = function IsTraceInfoEnabled() {
    return TraceConfig._TraceInfo;
};

var g_traceConfig = new TraceConfig();

function TraceParameters(appName) {
    if (g_traceConfig.IsTraceParamEnabled()) {
        if (rteLogger.isDebugEnabled()) {
            rteLogger.debug("Parameters of rad object: " + appName.toString() + ": ");
        }

        var i;
        for (i = 1; i < arguments.length; i++) {
            if (rteLogger.isDebugEnabled()) {
                rteLogger.debug(arguments[i]);
            }
        }
    }
}

function TraceReturnValue(appName, value) {
    if (g_traceConfig.IsTraceReturnValueEnabled()) {
        rteLogger.info("Application: " + appName.toString() + " return: " + value);
    }
}

function TraceException(funcName, exception) {
    if (g_traceConfig.IsTraceExceptionEnabled()) {
        rteLogger.error("Exception: " + exception.toString() + " was caught in function: " + funcName.toString());
        rteLogger.error("stack: " + exception.stack);
    }
}


function TraceInfo(info) {
    if (g_traceConfig.IsTraceInfoEnabled()) {
        rteLogger.info(info);
    }
}


function Logger() {}


Logger.prototype.TraceParameters = function TraceParameters(appName) {
    if (g_traceConfig.IsTraceParamEnabled()) {
        if (rteLogger.isDebugEnabled()) {
            rteLogger.debug("Parameters of rad object: " + appName.toString() + ": ");
        }

        var i;
        for (i = 1; i < arguments.length; i++) {
            if (rteLogger.isDebugEnabled()) {
                rteLogger.debug(arguments[i]);
            }
        }
    }
};

Logger.prototype.TraceReturnValue = function TraceReturnValue(appName, value) {
    if (g_traceConfig.IsTraceReturnValueEnabled()) {
        rteLogger.info("Application: " + appName.toString() + " return: " + value);
    }
};

Logger.prototype.TraceException = function TraceException(funcName, exception) {
    if (g_traceConfig.IsTraceExceptionEnabled()) {
        rteLogger.error("Exception: " + exception.toString() + " was caught in function: " + funcName.toString());
    }
};


Logger.prototype.TraceInfo = function TraceInfo(info) {
    if (g_traceConfig.IsTraceInfoEnabled()) {
        rteLogger.info(info);
    }
};


var logger = new Logger();

function GetDefaultLogger() {
    return logger;
}