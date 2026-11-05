//var log = getLog('RemoteJavascriptService');

/**
 * @private called by client
 * @param argStr
 */
function call(argStr, nullArg, collAttach) {
    var result = {};
    var scriptName;
    try {
        var argObj = JSON.parse(argStr);
        scriptName = argObj.scriptName;
        var func = getFunction(argObj);
        var args = argObj.params;

        if (collAttach != null) {
            args.push(collAttach);
        }

        var retVal = func.apply(this, args);
        result.retVal = retVal;
    } catch (e) {
        if (!e.errorCode) {
            e = createJsRuntimeError(e.message);
        }
        result.error = e;
    }
    //modified by Henrry on 09/10/2014 to make Task Planner remotes js use "rteJSONStringify" for improving performance.
    //Task planner related remote js will always inclue "c", so here using scriptName == "c" && args.toString().indexOf("#taskPlannerRemoteService")==0) to indicate it is task planner remote js
    if (scriptName == "CalendarService" || (scriptName == "c" && args.toString().indexOf("#taskPlannerRemoteService") == 0)) {
        return rteJSONStringify(result);
    } else {
        return JSON.stringify(result);
    }
}

/**
 * Get function reference in script library
 * Do validation
 * @private
 * @param {string} argObj.scriptName
 * @param {string} argObj.functionName
 * @returns {*}
 */
function getFunction(argObj) {
    var scriptName = argObj.scriptName;
    if (!scriptName) {
        throw createFunctionNotFoundError('scriptName is empty!');
    }
    var funcName = argObj.functionName;
    if (!funcName) {
        throw createFunctionNotFoundError('functionName is empty!');
    }

    if (!lib[scriptName] || !lib[scriptName][funcName]) {
        throw createFunctionNotFoundError('script not found! ' + scriptName);
    }
    return lib[scriptName][funcName];
}

/**
 * Create error object for function not found
 * @public
 * @param {string} msg
 * @returns {Error}
 */
function createFunctionNotFoundError(msg) {
    return createError('0001', 'FunctionNotFound', msg);
}

/**
 * Create error object for incorrect parameter
 * @public
 * @param {string} msg
 * @returns {Error}
 */
function createInvalidParameterError(msg) {
    return createError('0002', 'InvalidParameter', msg);
}

/**
 * Create error object for security check failed
 * @public
 * @param {string} msg
 * @returns {Error}
 */
function createIllegalAccessError(msg) {
    return createError('0003', 'IllegalAccess', msg);
}

/**
 * Create error object for all kinds of uncaught js error
 * @public
 * @param {string} msg
 * @returns {Error}
 */
function createJsRuntimeError(msg) {
    return createError('0009', 'JsRuntimeError', msg);
}

/**
 * Create error object for remote js
 * @public
 * @param {string} errorCode
 * @param {string} errorType
 * @param {string} msg
 * @returns {Error}
 */
function createError(errorCode, errorType, msg, severity) {
    var errorObj = new Error();
    errorObj.errorCode = errorCode;
    errorObj.errorType = errorType;
    errorObj.message = msg;
    errorObj.severity = severity;
    return errorObj;
}


//--------------------- add for ide -------------------------
lib.RemoteJavascriptService = {
    "createFunctionNotFoundError": createFunctionNotFoundError,
    "createInvalidParameterError": createInvalidParameterError,
    "createIllegalAccessError": createIllegalAccessError,
    "createError": createError
};