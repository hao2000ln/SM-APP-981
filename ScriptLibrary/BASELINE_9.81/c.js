/**
 * The ScriptLibrary is for common utility
 * 
 * @module c
 * @author Hao Ding <hao.ding@hp.com>
 */

/**
 * order in usage frequency
 * 
 * @private
 * @type {function[]}
 */
var __hs__ = [$SCFile, $SCFile2, $JSBeanFactory, $Class];

/**
 * The entrance '$' function
 * 
 * @param {*} arg0
 *          any arguments passed to this entrance
 * @returns the result for function defined in __hs__
 */
function $(arg0) {
    if (arg0 == null) {
        throw 'Argument[' + arg0 + '] does not supported!';
    }
    var rt = null;
    var hs = __hs__;
    var i;
    var length = hs.length;
    for (i = 0; i < length; i++) {
        if (hs[i].accept(arg0)) {
            rt = arguments.length > 1 ? hs[i].apply(hs[i], arguments) : hs[i](arg0);
            break;
        }
    }

    if (i >= length) {
        throw 'Argument[' + arg0 + '] does not supported!';
    }

    return rt;
}

// Save a reference to some core methods
var _slice = Array.prototype.slice;
var _str = funcs.str;
var _type = funcs.type;
var _copycurrent = funcs.copycurrent;
var _fduplicate = funcs.fduplicate;

// SM Constants

/**
 * SM types
 * 
 * @private
 * @type {Object.<string, number>}
 */
var sctypes = {
    /**
     * @name $.Number
     * @memberof module:c
     * @type {number}
     * @default 1
     */
    Number: 1,
    /**
     * @name $.Character
     * @memberof module:c
     * @type {number}
     * @default 2
     */
    Character: 2,
    /**
     * @name $.Datetime
     * @memberof module:c
     * @type {number}
     * @default 3
     */
    Datetime: 3,
    /**
     * @name $.Logical
     * @memberof module:c
     * @type {number}
     * @default 4
     */
    Logical: 4,
    /**
     * @name $.Label
     * @memberof module:c
     * @type {number}
     * @default 5
     */
    Label: 5,
    /**
     * @name $.File
     * @memberof module:c
     * @type {number}
     * @default 6
     */
    File: 6,
    /**
     * @name $.Offset
     * @memberof module:c
     * @type {number}
     * @default 7
     */
    Offset: 7,
    /**
     * @name $.Array
     * @memberof module:c
     * @type {number}
     * @default 8
     */
    Array: 8,
    /**
     * @name $.Structure
     * @memberof module:c
     * @type {number}
     * @default 9
     */
    Structure: 9,
    /**
     * @name $.Operator
     * @memberof module:c
     * @type {number}
     * @default 10
     */
    Operator: 10,
    /**
     * @name $.Expression
     * @memberof module:c
     * @type {number}
     * @default 11
     */
    Expression: 11,
    /**
     * @name $.PseudoField
     * @memberof module:c
     * @type {number}
     * @default 12
     */
    PseudoField: 12,
    /**
     * @name $.GlobalVariable
     * @memberof module:c
     * @type {number}
     * @default 13
     */
    GlobalVariable: 13,
    /**
     * @name $.LocalVariable
     * @memberof module:c
     * @type {number}
     * @default 14
     */
    LocalVariable: 14
};

Object.keys(sctypes).forEach(function(name) {
    $[name] = sctypes[name];
});

/**
 * SM key types
 * 
 * @private
 * @type {Object.<string, number>}
 */
var keyTypes = {
    /**
     * @name $.keyType.Primary
     * @memberof module:c
     * @type {number}
     * @default 28
     */
    Primary: 28,
    /**
     * @name $.keyType.Unique
     * @memberof module:c
     * @type {number}
     * @default 12
     */
    Unique: 12,
    /**
     * @name $.keyType.NoNulls
     * @memberof module:c
     * @type {number}
     * @default 4
     */
    NoNulls: 4,
    /**
     * @name $.keyType.NoDuplicates
     * @memberof module:c
     * @type {number}
     * @default 8
     */
    NoDuplicates: 8,
    /**
     * @name $.keyType.NullAndDuplicates
     * @memberof module:c
     * @type {number}
     * @default 0
     */
    NullAndDuplicates: 0,
    /**
     * @name $.keyType.IRKey
     * @memberof module:c
     * @type {number}
     * @default 64
     */
    IRKey: 64
};

$.keyType = keyTypes;

/**
 * Retrieve the string format of type for the given type number
 * 
 * @param {number} type
 *          the number value for a type, e.g.:2 means Character
 * @returns {string} the string format for the type
 * @method $.scTypeToString
 * @memberof module:c
 */
$.scTypeToString = function(type) {
    var typeStr = "Unknown";
    var name;
    for (name in sctypes) {
        var sctype = sctypes[name];
        if (sctype == type) {
            typeStr = name;
            break;
        }
    }
    return typeStr;
};

/**
 * Check if the type is a primitive type
 * 
 * @param {number} type
 *          the number value for a type, e.g.:2 means Character
 * @returns {boolean} If it is a primitive type, returns true.
 * @method $.isPrimitiveType
 * @memberof module:c
 */
$.isPrimitiveType = function(type) {
    return type != $.Array && type != $.Structure;
};

/**
 * Not supported characters in query
 * 
 * @name $.NOT_SUPPORTED_QUERY_CHARATERS
 * @memberof module:c
 * @type {string}
 */
$.NOT_SUPPORTED_QUERY_CHARATERS = "' \" & \\ [ ] : | < > + = ; , ? # *";

/*-------------------------------------------
 / Common Functions
 /--------------------------------------------*/

/**
 * Print the status message to avoid the client die for a long-running task
 * 
 * @param {string} msg
 *          The status message
 * @param {number} count
 *          The current step for the task
 * @param {number} threshold
 *          [threshold=10] - After the number of steps, print the message.
 * @param {number} last
 *          [last=false] - Is it the last step? If so, print the message also.
 * @method $.printStatus
 * @memberof module:c
 */
$.printStatus = function(msg, count, threshold, last) {
    threshold = threshold || 10;
    last = last || false;
    if (count % threshold == 0) {
        print(msg);
    } else if (last) {
        print(msg);
    }
};

/**
 * Deprecated, use lib.Underscore instead Determines whether a string ends with the characters of another string, returning true or false as appropriate.
 * 
 * @param {string} str
 *          The chosen string
 * @param {string} suffix
 *          The characters to be searched for at the end of this string.
 * @returns {boolean} True if appropriate *
 * @method $.endsWith
 * @memberof module:c
 */
$.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

/**
 * Deprecated, use lib.Underscore instead Determines whether a string starts with the characters of another string, returning true or false as appropriate.
 * 
 * @param {string} str
 *          The chosen string
 * @param {string} prefix
 *          The characters to be searched for at the start of this string.
 * @returns {boolean} True if appropriate *
 * @method $.startsWith
 * @memberof module:c
 */
$.startsWith = function(str, prefix) {
    return str.indexOf(prefix) === 0;
};

/**
 * removes whitespace and other predefined characters from both sides of a string.
 * 
 * @param {string} str
 *          The chosen string
 * @returns {string} The string after whitespace removed.
 * @method $.trim
 * @memberof module:c
 */
$.trim = function(str) {
    if (str != null) {
        str = str.trim();
    }
    return str;
};

/**
 * Deprecated, use lib.Underscore instead Check if a SM array or a JS array or a SM/JS string is empty.
 * 
 * @param {(string|Array)} value
 *          a SM array or a JS array or a SM/JS string
 * @returns {boolean} True if it is an empty array or an empty string
 * @method $.isEmpty
 * @memberof module:c
 */
$.isEmpty = function(value) {
    if (value == null) {
        return true;
    }

    if (Array.isArray(value)) {
        return value.length == 0;
    } else {
        var type = _type(value);
        if (type == $.Array) {
            return funcs.denull(value).length() == 0;
        } else if (type == $.Character) {
            return value.length == 0;
        } else {
            return false;
        }
    }
};

/**
 * Deprecated, use lib.Underscore instead Returns the first index at which a given element can be found in the array/string
 * 
 * @param {(string|Array)} src
 *          a SM array or a JS array or a SM/JS string
 * @param {*} value
 *          A string value or an array field value
 * @returns {number} the first index can be found
 * @method $.indexOf
 * @memberof module:c
 */
$.indexOf = function(src, value) {
    if (!$.isEmpty(src) && value != null) {
        var i;
        if (Array.isArray(src)) {
            for (i = 0; i < src.length; i++) {
                if (value == src[i]) {
                    return i;
                }
            }
        } else {
            var type = _type(src);
            if (type == $.Array) {
                var iLoopTimes = src.length();
                for (i = 0; i < iLoopTimes; i++) {
                    if (value == src[i]) {
                        return i;
                    }
                }
            } else if (type == $.Character) {
                return src.indexOf(value);
            } else {
                throw "Can't check index for " + _str(value);
            }
        }
    }
    return -1;
};

/**
 * Deprecated, use lib.Underscore instead Determines whether one string/array field may be found within another string/array, returning true or false as appropriate.See {@link module:c.$.indexOf}
 * 
 * @param {(string|Array)} src
 *          a SM array or a JS array or a SM/JS string
 * @param {*} value
 *          A string value or an array field value
 * @returns {boolean} True if as appropriate
 * @method $.contains
 * @memberof module:c
 */
$.contains = function(src, value) {
    return $.indexOf(src, value) != -1;
};

/**
 * Check whether a string contains specific characters which SM query does not support. some specific characters used in reg expression: ^ - \\^ \ - \\\\ [ - \[ ] - \\]
 * 
 * @param {string} strValue
 *          the chosen string
 * @returns {boolean} True if as appropriate
 * @method $.isValidQueryString
 * @memberof module:c
 */
$.isValidQueryString = function(strValue) {
    const specCharReg = "[\\^%&\"'[\\],;:=<>+|?#*\\\\$]+";
    var searchResult = strValue.search(specCharReg);
    return searchResult == -1;
};

/*-------------------------------------------
 / RAD Proxy
 /--------------------------------------------*/

/**
 * Create a SM array
 * 
 * @param {*}
 *          The array field values, default to create an empty array.
 * @returns A sm array.
 * @method $.createSCArray
 * @memberof module:c
 */
$.createSCArray = function( /* arg0, arg1, arg2, ... */ ) {
    var obj = new SCDatum();
    obj.setType($.Array);

    var length = arguments.length;
    if (length > 0) {
        var i;
        for (i = 0; i < length; i++) {
            obj.push(arguments[i]);
        }
    }
    return obj;
};

/**
 * Create a SM structure
 * 
 * @param {*}
 *          The structure field values, default to create an empty structure.
 * @returns A sm structure.
 * @method $.createSCStructure
 * @memberof module:c
 */
$.createSCStructure = function( /* arg0, arg1, arg2, ... */ ) {
    var obj = new SCDatum();
    obj.setType($.Structure);
    var length = arguments.length;
    if (length > 0) {
        var i;
        for (i = 0; i < length; i++) {
            obj.push(arguments[i]);
        }
    }

    return obj;
};

/**
 * Select the result from cache for simple duplicate sql query if it exists . Otherwise, get the result from db directly
 * 
 * @param {String} fileName - The file that query run against 
 * @param {String} query - the simple query string       
 * @returns the query result either from db or from cache directly
 * @method $.cachedSelect
 * @memberof module:c
 */
$.cachedSelect = function(fileName, query) {

    var file = getSimpleCacheValue(fileName, query);
    if (file == null) {
        file = new SCFile(fileName);
        if (file.doSelect(query) === RC_SUCCESS) {
            setSimpleCacheValue(fileName, query, file);
        } else {
            file = undefined;
        }
    }

    return file;
};


/**
 * Use array as method arguments
 * 
 * @param {string} array
 *          a SM array or a JS array
 * @returns the arguments string
 */
function constructArguments(array) {
    var argumentsStr = "";
    var field;
    var i;
    if (Array.isArray(array)) {
        for (i = 0; i < array.length; i++) {
            argumentsStr += ',';
            field = array[i];
            if (_type(field) == $.Character) {
                argumentsStr += '"' + field + '"';
            } else {
                argumentsStr += field;
            }
        }
    } else {
        var iLoopTimes = array.length();
        for (i = 0; i < iLoopTimes; i++) {
            argumentsStr += ',';
            field = array[i];
            if (_type(field) == $.Character) {
                argumentsStr += '"' + field + '"';
            } else {
                argumentsStr += field;
            }
        }
    }
    return argumentsStr;
}

function createRequest() {
    return {
        // handle asynchronous call
        handlers: [],

        handlerResult: null,

        exceptionHandler: null,

        // configurations for handling request
        RECALL_CURRENT_HANDLER: false,

        recallCurrentHandler: function recallCurrentHandler(recall) {
            this.RECALL_CURRENT_HANDLER = recall;
        },

        getHandlerResult: function getHandlerResult() {
            return this.handlerResult;
        },

        setHandlers: function setHandlers( /* arg0, arg1, arg2, ... */ ) {
            var length = arguments.length;
            if (length > 0) {
                var i;
                for (i = 0; i < length; i++) {
                    this.handlers.push(arguments[i]);
                }
            }
        },

        setExceptionHandler: function setExceptionHandler(handler) {
            this.exceptionHandler = handler;
        },

        // handle request variables
        params: {},
        attrs: {},
        // used for redirect
        redirect: function(requestType, requestParameters) {
            this.attrs = requestParameters;
            this.attrs["$L.redirect.request.type"] = requestType;
            return "redirect";
        },

        getParameter: function(name) {
            return this.params[name];
        },
        setAttribute: function(name, value) {
            this.attrs[name] = value;
        },
        getAttribute: function(name) {
            return this.attrs[name];
        },
        removeAttribute: function(name) {
            delete this.attrs[name];
        },

        // handle thread variables
        getThread: function() {
            return {
                setAttribute: function(name, value) {
                    lib.executor.SetTLSValue(name, value);
                },
                getAttribute: function(name) {
                    return lib.executor.GetTLSValue(name);
                },
                removeAttribute: function(name) {
                    return lib.executor.RemoveTLSValue(name);
                }
            };
        },

        // handle global variables
        getGlobal: function() {
            return {
                setAttribute: function(name, value) {
                    system[name] = value;
                },
                getAttribute: function(name) {
                    return system[name];
                },
                removeAttribute: function(name) {
                    delete system[name];
                }
            };
        }
    };
}

/**
 * handle a MVC request
 * 
 * @param beanName
 *          JS bean name
 * @param methodName
 *          JS method name
 * @param requestNames
 *          SM array for request parameter names
 * @param requestValues
 *          SM array for request parameter values
 * @param viewNames
 *          SM array for request attribute names
 * @param viewValues
 *          SM array for request attribute values
 */
function doRequest(beanName, methodName, requestNames, requestValues, viewNames, viewValues) {
    // handle request parameters of record type
    var records = {};
    var i;
    var length = arguments.length;
    if (length > 6 && length % 2 == 0) {
        var recordList = _slice.call(arguments, 6);
        var recordName = null;
        for (i = 0; i < recordList.length; i++) {
            if (i % 2 == 0) {
                recordName = recordList[i];
            } else {
                records[recordName] = recordList[i];
            }
        }
    }

    var request = createRequest();

    var requestParams = request.params;
    var iLoopTimes = requestNames.length();
    for (i = 0; i < iLoopTimes; i++) {
        var requestName = requestNames[i];
        if (records[requestName] != null) {
            // The record type is passed through js arguments
            requestParams[requestName] = records[requestName];
        } else {
            requestParams[requestName] = requestValues[i];
        }
    }
    var requestAttrs = request.attrs;
    iLoopTimes = viewNames.length();
    for (i = 0; i < iLoopTimes; i++) {
        requestAttrs[viewNames[i]] = viewValues[i];
    }

    var bean = $JSBeanFactory(beanName, [request]);

    var result;
    if (bean) {
        result = bean[methodName].apply(bean, [request]);
    }

    function setViewResult() {
        var reqAttrs = request.attrs;
        var name;
        for (name in reqAttrs) {
            viewNames.push(name);
            viewValues.push(reqAttrs[name]);
        }
    }

    var handlers = request.handlers;
    var exceptionHandler = request.exceptionHandler;
    var handlersLength = handlers.length;
    if (handlersLength > 0) {
        i = 0;

        function doNextHandler(res) {
            // set handler result
            request.handlerResult = res;

            // call it again when RECALL_CURRENT_HANDLER is true
            if (!request.RECALL_CURRENT_HANDLER) {
                i++;
            }
            var handler = handlers[i - 1];
            if (i == handlersLength) {
                lib.executor.ScheduleAsyncCall(bean, handler, [request], null, function(res) {
                    setViewResult();
                    return res;
                }, null, bean, exceptionHandler, request);
            } else {
                lib.executor.ScheduleAsyncCall(bean, handler, [request], null, doNextHandler, null, bean,
                    exceptionHandler, request);
            }
        }

        doNextHandler();
    } else {
        setViewResult();
        return result;
    }
}

/**
 * Set view object to vars.$L_view_names and vars.$L_view_values
 * 
 * @deprecated use doRequest
 * @param {Object} obj
 *          All request attributes and related values.
 * @method $.setViewObject
 * @memberof module:c
 */
$.setViewObject = function(obj) {
    var name;
    for (name in obj) {
        var value = obj[name];
        vars.$L_view_names.push(name);
        vars.$L_view_values.push(value);
    }
};

/**
 * Call a RAD application using "callrad"
 * 
 * @deprecated by lib.executor.CallRad
 * @param {string} appName
 *          The RAD application name.
 * @param {Object} parameters
 *          The RAD application parameters.
 * @param {boolean} newThread
 *          [newThread=false] - Need start a new thread?
 * @method $.callrad
 * @memberof module:c
 */
$.callrad = function(appName, parameters, newThread) {
    var rteReturnValue = new SCDatum();
    var rteNames = new SCDatum();
    var rteValues = new SCDatum();
    newThread = newThread || false;
    var name;
    for (name in parameters) {
        rteNames.push(name);
        rteValues.push(parameters[name]);
    }
    funcs.rtecall("callrad", rteReturnValue, appName, rteNames, rteValues, newThread);
};

/**
 * Call a RAD application by reference using "js.runRad"
 * 
 * @deprecated by lib.executor.CallRad
 * @param {string} appName
 *          The RAD application name.
 * @param {Object} parameters
 *          The RAD application parameters.
 * @param {boolean} newThread
 *          [newThread=false] - Need start a new thread?
 * @method $.callradByRef
 * @memberof module:c
 */
$.callradByRef = function(appName, parameters, newThread) {
    results = results || $.createSCArray();
    newThread = newThread || false;
    var rteReturnValue = new SCDatum();
    var rteNames = new SCDatum();
    var rteValues = new SCDatum();

    var parmNames = new SCDatum();
    var parmValues = new SCDatum();
    var parmTypes = new SCDatum();

    var name;
    for (name in parameters) {
        parmNames.push(name);
        parmValues.push(parameters[name]);
        var type = _type(parameters[name]);
        if (type == null || type == 0) {
            type = $.File;
        }
        parmTypes.push(type);
    }

    rteNames.push("name");
    rteNames.push("names");
    rteNames.push("values");
    rteNames.push("numbers");
    rteNames.push("description");

    rteValues.push(appName);
    rteValues.push(parmNames);
    rteValues.push(parmValues);
    rteValues.push(parmTypes);
    rteValues.push(parmNames);

    funcs.rtecall("callrad", rteReturnValue, "js.runRad", rteNames, rteValues, newThread);

    var results = vars.$smtestresult;
    var i = 0;
    for (name in parameters) {
        parameters[name] = results[i];
        i++;
    }
    return results;
};

/**
 * Call a SM process using "Rule.callProcess"
 * 
 * @deprecated by lib.executor.CallRad
 * @param {string} name
 *          The RAD process name.
 * @method $.callProcess
 * @memberof module:c
 */
$.callProcess = function(name) {
    var parameters = {};
    parameters["text"] = "<rule><callProcess><process>" + name + "</process></callProcess></rule>";
    parameters["file"] = vars.$L_file;
    parameters["second.file"] = vars.$L_file_save;
    parameters["index"] = vars.$L_result;
    parameters["prompt"] = vars.$L_message;
    parameters["names"] = vars.$L_names;
    parameters["values"] = vars.$L_values;
    $.callrad("Rule.callProcess", parameters);
};

/**
 * Call the document engine "se.search.engine"
 * 
 * @deprecated by lib.executor.CallRad
 * @param {string} fileName
 *          The file be searched
 * @param {string} queryStr
 *          The query string
 * @method $.callSearchEngine
 * @memberof module:c
 */
$.callSearchEngine = function(fileName, queryStr) {
    $.callrad("se.search.engine", {
        text: fileName,
        query: queryStr
    });
};


/**
 * Compile JavaScript
 *
 * @param {string} script
 * @param {name} description
 */
$.compileJavaScript = function(script, description) {
    return compile(script, description);
};

/*
 * Simple JavaScript Inheritance By John Resig http://ejohn.org/ MIT Licensed.
 */
// Inspired by base2 and Prototype
var fnTest = /xyz/.test(function() {
    xyz;
}) ? /(\bcallSuper\b)|(\b_super\b)/ : /.*/;

/**
 * The inheritance method
 * 
 * @private
 * @param {*} arg0
 *          The parent class
 * @param {*} arg1
 *          The current class
 */
function $Class(arg0, arg1) {
    var parent;
    var prop;
    if (arg1) {
        parent = arg0;
        prop = arg1;
    } else {
        // The base Class implementation (does nothing)
        parent = new Function();
        prop = arg0;
    }

    var _super = parent.prototype;
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    var P = new Function();
    P.prototype = parent.prototype;
    var classPrototype = new P();

    // Copy the properties over onto the new prototype
    var name;
    for (name in prop) {
        // Check if we're overwriting an existing function
        classPrototype[name] =
            (typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name])) ?
            (function(name, fn) {
                return function() {
                    var tmp = this._super;
                    // Add a new this.callSuper() method to get the super class
                    this.callSuper = function() {
                        return _super;
                    };
                    // Add a new this._super() method to get the super method
                    this._super = _super[name];
                    // The method only need to be bound temporarily, so we
                    // remove it when we're done executing
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) : prop[name];
    }

    //

    var Class = new Function("return lib.c.$.$$Class.apply( this, arguments )");
    // Populate our constructed prototype object
    Class.prototype = classPrototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    return Class;
}

/**
 * Check if the entrance {@link module:c.$} will go to {@link module:c.$Class}
 * 
 * @private
 * @method $Class.accept
 * @memberof module:c
 */
$Class.accept = function(arg0) {
    return typeof arg0 == 'object' || typeof arg0 == 'function';
};

/**
 * Call the init method when initialize a class instance
 * 
 * @private
 * @method $.$$Class
 * @memberof module:c
 */
$.$$Class = function() {
    if (this.init) {
        this.init.apply(this, arguments);
    }

    return this;
};

/*-------------------------------------------
 / JSBeanFactory
 /--------------------------------------------*/
var JSBeanFactoryPattern = /^#/;
var objects = {}; // to hold all singleton bean instances

/**
 * Get a javascript bean or invoke a public method of javascript bean
 * 
 * @private
 * @param {string} name
 *          The javascript bean name
 */
function $JSBeanFactory(name /* , arg0, arg1, arg2, ... */ ) {
    var c0 = name.charAt(0);
    if ('#' == c0) {
        var instanceName = name.substring(1);

        var length = arguments.length;
        var obj = null;
        if (length > 1) {
            var initParams = arguments[1];
            if (_type(initParams) == $.Array) {
                function createBean() {
                    var q = [];
                    var i;
                    if (Array.isArray(initParams)) {
                        for (i = 0; i < initParams.length; i++) {
                            q.push("initParams[" + i + "]");
                        }
                    } else {
                        var iLoopTimes = initParams.length();
                        for (i = 0; i < iLoopTimes; i++) {
                            q.push("initParams[" + i + "]");
                        }
                    }
                    try {
                        return eval("new $.$JSBeanFactory(instanceName," + q.join(",") + ")");
                    } catch (e) {
                        getLog("c").error("$JSBeanFactory", e.message);
                        return null;
                    }
                }

                obj = createBean();

                if (!obj) {
                    return null;
                }

                if (length > 2) {
                    return obj.invoke.apply(obj, _slice.call(arguments, 2));
                } else {
                    return obj.deref();
                }
            } else {
                obj = new $.$JSBeanFactory(instanceName);
                return obj.invoke.apply(obj, _slice.call(arguments, 1));
            }
        } else {
            obj = new $.$JSBeanFactory(instanceName);
            return obj.deref();
        }
    }
}

//
// JSBeanFactory Wrapper Class
//
$.$JSBeanFactory = $Class(new function() {
    // private section
    var name = null;
    var obj = null;

    // public section
    return {
        init: function(instanceName /* , initParam1, initParam2 */ ) {
            obj = objects[instanceName];
            if (!obj) {
                var jsBeanFactory = $("JSBeanFactory", SCFILE_READONLY).select('name="' + instanceName + '"').uniqueResult();
                if (jsBeanFactory != null) {
                    var usedClass = jsBeanFactory["used.class"];
                    var libObj = lib[usedClass];
                    if (libObj) {
                        var getClass = libObj.getClass;
                        if (getClass && typeof getClass == 'function') {
                            var klass = getClass();
                            var newObject = (function() {
                                function F(args) {
                                    return klass.apply(this, args);
                                }
                                F.prototype = klass.prototype;
                                return function() {
                                    return new F(arguments);
                                };
                            })();

                            if (arguments.length > 1) {
                                obj = newObject.apply(null, _slice.call(arguments, 1));
                            } else {
                                obj = newObject();
                            }

                            var scope = jsBeanFactory["scope"];
                            // save singleton
                            if (scope == 0) {
                                objects[instanceName] = obj;
                            }
                        } else {
                            throw 'Function "getClass" does not exist in lib[' + usedClass + ']!!';
                        }
                    } else {
                        throw 'Lib Name [' + usedClass + '] does not exist!!';
                    }
                } else {
                    throw 'Name [' + instanceName + '] does not exist in JSBeanFactory!!';
                }
            }

            name = instanceName;
            return this;
        },

        // invoke function
        invoke: function(fName /* , arg0, arg1, ... */ ) {
            if (fName && typeof fName === 'string') {
                var f = obj[fName];
                if (typeof f === 'function') {
                    return f.apply(obj, _slice.call(arguments, 1));
                } else {
                    // return undefined if the function is not exists
                    return undefined;
                }
            }

            throw 'Object instance with name[' + name + '] does not have function[' + fName + ']!!';
            //return undefined;
        },

        deref: function() {
            return obj;
        }
    };
});

/**
 * Check if the entrance {@link module:c.$} will go to {@link module:c.$JSBeanFactory}
 * 
 * @private
 * @method $JSBeanFactory.accept
 * @memberof module:c
 */
$JSBeanFactory.accept = function(arg0) {
    return typeof arg0 === 'string' && JSBeanFactoryPattern.test(arg0);
};

/*-------------------------------------------
 / SCFile
 /--------------------------------------------*/
var scfilePattern = /^[a-zA-Z]/;
var scfile2Pattern = /^![a-zA-Z]/;

/**
 * Get a proxy for SM SCFile
 * 
 * @private
 * @param {string} fileName
 *          The SM file name
 * @param {int} readOnly
 *          whether open record with readonly mode. Usually the SCFILE_READONLY is used.
 */
function $SCFile(fileName, readOnly) {
    if (!(readOnly === undefined)) {
        return new $.$SCFile(fileName, readOnly);
    } else {
        return new $.$SCFile(fileName);
    }
}


/**
 * Check if the entrance {@link module:c.$} will go to {@link module:c.$SCFile}
 * 
 * @private
 * @method $SCFile.accept
 * @memberof module:c
 */
$SCFile.accept = function(arg0) {
    return (typeof arg0 === 'string') && scfilePattern.test(arg0);
};


function $SCFile2(fileName, isEdit) {
    this.readonly = !isEdit;
    if (isEdit) {
        return new $.$SCFile(fileName.substring(1));
    }

    var item = new $.$SCFile(fileName.substring(1), SCFILE_READONLY);
    item.readonly = true;
    return item;
}

$SCFile2.accept = function(arg0) {
    return (typeof arg0 === 'string') && scfile2Pattern.test(arg0);
};

//
// SCFile Wrapper Class
//
/**
 * @class $SCFile
 * @classdesc The proxy class for SM SCFile.
 */
$.$SCFile = $Class(
    /** @lends $SCFile.prototype */
    {
        scfile: null,
        rc: null,
        fileName: null,
        success: false,
        readonly: false,
        returnFields: null,

        init: function(fileName, readOnly) {
            this.rc = null;
            this.fileName = fileName;

            if (!(readOnly === undefined)) {
                this.scfile = new SCFile(fileName, readOnly);
            } else {
                this.scfile = new SCFile(fileName);
            }
            this.fields = this.setFields;
            this.one = this.uniqueResult;
            this.each = this.iterate;
            this.forEach = this.iterate;
            this.orderBy = this.sortBy;
            this.success = false;
            return this;
        },

        /**
         * Set orders by
         * 
         * @param {string[]} fields
         *          Fields need be ordered by
         * @param {number[]} orders
         *          An orders array to match fields, e.g. [SCFILE_ASC, SCFILE_DSC]
         */
        setOrderBy: function(fields, orders) {
            this.scfile.setOrderBy(fields, orders);
            return this;
        },

        sortBy: function(fields) {
            var sortFields = fields;
            if (typeof(fields) == 'string') {
                sortFields = Array.prototype.slice.call(arguments);
            }

            var listFields = [];
            var listOrder = [];
            var k;
            for (k = 0; k < sortFields.length; k++) {
                var field = sortFields[k];
                if (field.length < 0) {
                    continue;
                }
                var c = field.charAt(0);
                if (c == '-' || c == '!') {
                    listFields.push(field.substring(1));
                    listOrder.push(SCFILE_DSC);
                } else if (c == '+') {
                    listFields.push(field.substring(1));
                    listOrder.push(SCFILE_ASC);
                } else {
                    listFields.push(field);
                    listOrder.push(SCFILE_ASC);
                }
            }

            this.scfile.setOrderBy(listFields, listOrder);
            return this;
        },

        /**
         * Set Fields list
         * 
         * @param {string[]} fields
         *          Fields that should be selected
         */
        setFields: function(fields) {
            this.returnFields = fields;
            if (typeof(fields) == 'string') {
                this.returnFields = Array.prototype.slice.call(arguments);
            }

            this.scfile.setFields(this.returnFields);
            return this;
        },

        _doSelect: function(query, start, count) {
            this.rc = null;
            this.success = false;
            if (this.scfile) {

                if (start !== null && start !== undefined) {
                    this.rc = this.scfile.doSelectEx(query, start, count);
                } else {
                    this.rc = this.scfile.doSelect(query);
                }

                this.success = (this.rc == RC_SUCCESS);
            }

            return this;
        },

        /**
         * Select the result
         * 
         * @param {string} query
         *          The SM query
         */
        select: function(query, params) {
            if (!query || typeof query !== 'string') {
                query = 'false'; // select nothing if query is non-string
            }

            if (params && _type(params) == $.Array) {
                var i;
                for (i = 0; i < params.length; i++) {
                    query = query.replace(/%S/, params[i]);
                }
            }

            return this._doSelect(query);
        },

        _makeParam: function(param) {
            if (null == param) {
                return 'NULL';
            }

            var type = typeof(param);

            if (type == 'number') {
                return param;
            }

            if (param instanceof Date) {
                return '\'' + funcs.str(param) + '\'';
            }

            if (type != 'string') {
                param = '' + param;
            }
            return '"' + lib.StringUtil.escapeAllStr(param) + '"';
        },

        makeSql: function(sql) {
            var args = arguments;
            var self = this;
            var argSize = args.length;

            if (argSize == 1) {
                return sql;
            }

            var sql1;
            if (argSize >= 2 && argSize <= 4 && _isObj(args[1])) {
                var params = args[1];
                sql1 = sql.replace(/:(\w+)/g, function(match, name) {
                    return typeof params[name] != 'undefined' ? self._makeParam(params[name]) : match;
                });
            } else {
                var number = 0;
                sql1 = sql.replace(/:(\w+)/g, function(match) {
                    number++;
                    return args[number] !== undefined ? self._makeParam(args[number]) : match;
                });
            }
            return sql1;
        },

        /**
         * Find with params
         * Params:
         *     1. query
         *     2. params
         * Usage 1: Use object as parameters
              var params={name: 'zhang', age:18, birth: new Date()};
              .find('name=:name and age=:age and birth=:birth', params);
               
              => name="zhang" and age=18 and birth='11/12/19 14:54:20'
           Usage 2: Use param array as parameters
              .find('name=:1 and age=:2 and birth=:3', 'zhang', 18, new Date());
              => name="zhang" and age=18 and birth='11/12/19 14:54:20'
         */
        find: function() {
            this._checkReadonly();
            var args = arguments;
            var query = this.makeSql.apply(this, args);
            return this._doSelect(query);
        },

        _checkReadonly: function() {
            if (this.readonly && this.returnFields == null) {
                funcs.msg('setFields required before lib.c.$(\'!' + this.fileName + '\').find ' + lastStack(2), 2);
                var list = funcs.dbdict_helper("unique.key", this.fileName);
                this.setFields(list.toArray());
            }
        },

        _getPageParam: function(sql, args) {

            var isJsonParam = false;
            if (args.length > 2 && args.length <= 4) {
                isJsonParam = _isObj(args[1]);
            }

            var start = 1;
            var count = 10;
            var paramSize = 0;
            if (isJsonParam) {
                paramSize = 1;
            } else {
                var matches = sql.match(/:/);
                if (matches) {
                    paramSize = matches.length;
                } else {
                    // default 0
                }
            }

            if (args.length > paramSize + 1) {
                start = args[paramSize + 1];
            }

            if (args.length > paramSize + 2) {
                count = args[paramSize + 2];
            }

            return {
                "start": start,
                "count": count
            };
        },

        findx: function(sql) {
            this._checkReadonly();
            var args = Array.prototype.slice.call(arguments);
            var pageParam = this._getPageParam(sql, args);
            var query = this.makeSql.apply(this, args);
            return this._doSelect(query, pageParam.start, pageParam.count);
        },

        /**
         * Count the result
         * 
         * @param {string} query
         *          The SM query
         */
        count: function(query) {
            if (!query || typeof query !== 'string') {
                query = 'false'; // select nothing if query is non-string
            }

            this.rc = null;
            this.success = false;
            var count = 0;
            if (this.scfile) {
                count = this.scfile.doCount(query);
                this.rc = getLastRC();
                this.success = (this.rc == RC_SUCCESS);
            }
            return count;
        },

        /**
         * Same as select(true)
         */
        selectAll: function() {
            return this.select('true');
        },

        /**
         * Iterate the search result
         * 
         * @param callback
         *          The callback that handles the search result.
         */
        iterate: function(callback) {
            if (this.success && typeof callback === 'function') {
                this.rc = (this.rc === null ? this.scfile.getFirst() : this.rc);
                while (this.rc != RC_NO_MORE) {
                    if (callback.call(this, this.scfile) === true) {
                        break;
                    }
                    this.rc = this.scfile.getNext();
                }
            }
            return this.success;
        },

        /**
         * Get the unique result
         */
        uniqueResult: function() {
            if (this.success) {
                this.rc = (this.rc === null ? this.scfile.getFirst() : this.rc);
                return this.scfile;
            } else {
                return null;
            }
        },

        /**
         * Get the multiple results
         * 
         * @param readonly
         *          If true, the result set is read only(can't doUpdate/doDelete/getNext etc)
         */
        list: function(readonly) {
            if (readonly == null) {
                readonly = false;
            }

            var values = [];
            if (this.success) {
                this.rc = (this.rc === null ? this.scfile.getFirst() : this.rc);
                while (this.rc != RC_NO_MORE) {
                    var value = new SCDatum();
                    if (readonly) {
                        _copycurrent(value, this.scfile);
                    } else {
                        _fduplicate(value, this.scfile);
                    }
                    values.push(value);
                    this.rc = this.scfile.getNext();
                }
            }
            return values;
        },

        /**
         * Get the related dbdict record.
         */
        dbdict: function() {
            return $('dbdict').select('name="' + this.fileName + '"').uniqueResult();
        }
    });


function stack() {
    try {
        throw new Error();
    } catch (e) {
        return e.stack;
    }
}

function lastStack(n) {
    var list = stack().split('\n');
    if (!n) {
        n = 0;
    }

    var index = 3 + n;
    index = index > list.length - 2 ? list.length - 2 : index;
    return list[index];
}


function _isObj(value) {
    return null != value && typeof(value) == 'object' && !(value instanceof Date);
}