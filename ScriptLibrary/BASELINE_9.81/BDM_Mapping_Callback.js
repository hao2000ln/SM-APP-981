//
//--- Constants ---------------------------------
//
var DIRECTION = lib.BDM_Mapping_Constants.DIRECTION;
var CB = lib.BDM_Mapping_Constants.CALLBACK;
var CBF = lib.BDM_Mapping_Constants.CALLBACKFACTORY;

//
//-- logger --------------------------------------------
//
var log = getLog("BDM_Mapping_Callback");

//
//--- variable cache -----------------------------
//
var createSMBDMCallbackArgsObject = lib.BDM_Mapping_Callback_ArgsObj.createSMBDMCallbackArgsObject;
var createDefaultCallbackArgsObject = lib.BDM_Mapping_Callback_ArgsObj.createDefaultCallbackArgsObject;
var createSMBDMExecutor = lib.BDM_Mapping_Callback_Executor.createSMBDMExecutor;
var createDefaultExecutor = lib.BDM_Mapping_Callback_Executor.createDefaultExecutor;
var util_getObjectQFieldValue = lib.BDM_Util.getObjectQFieldValue;
var util_getObjectFieldValue = lib.BDM_Util.getObjectFieldValue;
var util_setObjectFieldValue = lib.BDM_Util.setObjectFieldValue;
var util_expandPrefixWithNS = lib.BDM_Util.expandPrefixWithNS;
var util_isArray = lib.BDM_Util.isArray;

var getParseProcessor = lib.BDM_Mapping_PEX.getParseProcessor;
var __restoreKeys = lib.BDM_Mapping_PEX.__restoreKeys;

var __default_callback_factory_ = null;
var __smbdm_callback_factory_ = null;


//
//--- callback factory ---------------------------
//
function getCallbackFactory(name) {
    var fa = null;
    if (CBF.SMBDM == name) {
        fa = getSMBDMCallbackFactory();
    } else {
        fa = getDefaultCallbackFactory();
    }
    return fa;
}

function getSMBDMCallbackFactory() {
    if (!__smbdm_callback_factory_) {
        __smbdm_callback_factory_ = createDefaultCallbackFactory();

        __smbdm_callback_factory_.setValueTranslator(lib.BDM_Mapping_ValueTrans.getSMBDMTranslator());

        __smbdm_callback_factory_.getSMDefaultValueTranslator = function() {
            return this.getEp1DefaultValueTranslator();
        };
        __smbdm_callback_factory_.getBDMDefaultValueTranslator = function() {
            return this.getEp2DefaultValueTranslator();
        };
        __smbdm_callback_factory_.setEp1DefaultValueTranslator(lib.BDM_Mapping_ValueTrans.getSMDefaultValueTranslator());
        __smbdm_callback_factory_.setEp2DefaultValueTranslator(lib.BDM_Mapping_ValueTrans.getBDMDefaultValueTranslator());

        __smbdm_callback_factory_.createArgsObject = function(mappingHandler, mappingEntry, smObj, bdmObj) {
            return createSMBDMCallbackArgsObject(mappingHandler, mappingEntry, smObj, bdmObj);
        };

        __smbdm_callback_factory_.getDefaultMappingCallback = function() {
            if (!this.defaultCallback) {
                this.defaultCallback = __createSMBDMDefaultMappingCallback();
            }
            return this.defaultCallback;
        };

        __smbdm_callback_factory_.getEvalCallback = function(callbackLiteral) {
            var callback = __createSMBDMEvalCallback();
            callback.setExpr(callbackLiteral);
            return callback;
        };
    }

    return __smbdm_callback_factory_;
}

function getDefaultCallbackFactory() {
    if (!__default_callback_factory_) {
        __default_callback_factory_ = createDefaultCallbackFactory();
        __default_callback_factory_.setValueTranslator(lib.BDM_Mapping_ValueTrans.getDefaultTranslator());
    }
    return __default_callback_factory_;
}

function createDefaultCallbackFactory() {
    return {

        valueTranslator: null,
        ep1DefaultValueTranslator: lib.BDM_Mapping_ValueTrans.getDefaultValueTranslator(),
        ep2DefaultValueTranslator: lib.BDM_Mapping_ValueTrans.getDefaultValueTranslator(),
        defaultCallback: null,

        setValueTranslator: function(translator) {
            this.valueTranslator = translator;
        },

        getValueTranslator: function() {
            return this.valueTranslator;
        },

        setEp1DefaultValueTranslator: function(translator) {
            this.ep1DefaultValueTranslator = translator;
        },

        getEp1DefaultValueTranslator: function() {
            return this.ep1DefaultValueTranslator;
        },

        setEp2DefaultValueTranslator: function(translator) {
            this.ep2DefaultValueTranslator = translator;
        },

        getEp2DefaultValueTranslator: function() {
            return this.ep2DefaultValueTranslator;
        },

        getCallback: function(callbackLiteral) {
            var callback = null;

            if (!callbackLiteral) {
                callback = this.getDefaultMappingCallback();
            } else if (callbackLiteral.indexOf("@lib.") == 0) {
                callbackLiteral = callbackLiteral.substring(1); // remove '@'
                callback = eval(callbackLiteral);
            } else {
                callback = this.getEvalCallback(callbackLiteral);
            }

            return callback;
        },

        invokeCallback: function(callback, argsObj) {
            if (callback && argsObj) {
                var fn = argsObj.isEp1ToEp2() ? CB.EP1TOEP2 : CB.EP2TOEP1;
                var __f = callback[fn];
                if (__f && typeof __f == 'function') {
                    __f.apply(callback, [argsObj]);
                }
            }
        },

        createArgsObject: function(mappingHandler, mappingEntry, ep1Obj, ep2Obj) {
            return createDefaultCallbackArgsObject(mappingHandler, mappingEntry, ep1Obj, ep2Obj);
        },

        getDefaultMappingCallback: function() {
            if (!this.defaultCallback) {
                this.defaultCallback = __createDefaultMappingCallback();
            }
            return this.defaultCallback;
        },

        getEvalCallback: function(callbackLiteral) {
            var callback = __createDefaultEvalCallback();
            callback.setExpr(callbackLiteral);
            return callback;
        }

    };
}

//
//--- callback functions -----------------------------
//
function __createDefaultMappingCallback() {
    var callback = {};

    callback[CB.EP1TOEP2] = function(argsObj) {
        var ep2Field = argsObj.getEp2Field();
        if (ep2Field) {
            var ep1FieldValue = argsObj.getFieldValue();
            if (ep1FieldValue != null) {
                __setObjectFieldValue(argsObj.getEp2Object(),
                    ep2Field, ep1FieldValue, argsObj.isEp2BadgerFishStyle());
            }
        }
    };

    callback[CB.EP2TOEP1] = function(argsObj) {
        var ep1Field = argsObj.getEp1Field();
        if (ep1Field) {
            var ep2FieldValue = argsObj.getFieldValue();
            if (ep2FieldValue != null) {
                __setObjectFieldValue(argsObj.getEp1Object(), ep1Field,
                    ep2FieldValue, argsObj.isEp1BadgerFishStyle());
            }
        }
    };

    return callback;
}

function __createSMBDMDefaultMappingCallback() {
    var callback = __createDefaultMappingCallback();

    //@override callback[ CB.EP2TOEP1 ]
    callback[CB.EP2TOEP1] = function(argsObj) {
        var smField = argsObj.getSMField();
        if (smField) {

            var targetFieldValue = argsObj.getFieldValue();
            targetFieldValue = __trans2ArrayDependsOnSM(argsObj, targetFieldValue);

            if (targetFieldValue != null) {
                __setObjectFieldValue(argsObj.getSMObject(), smField,
                    targetFieldValue, false);
            }
        }
    };

    return callback;
}

function __createDefaultEvalCallback() {
    var callback = {
        parser: null,
        createExecutor: createDefaultExecutor,
        setExpr: function(expr) {
            this.parser = getParseProcessor(expr);
        }
    };

    callback[CB.EP1TOEP2] =
        function(argsObj) {
            var ep2Field = argsObj.getEp2Field();
            if (ep2Field) {
                var ep1Obj = __get_wrapper(argsObj.getEp1Object(), argsObj, true);
                var ep2Obj = __get_wrapper(argsObj.getEp2Object(), argsObj, false);
                var fieldValue = this.evalHandler(argsObj, ep1Obj, ep2Obj);
                if (fieldValue != null) {
                    __setObjectFieldValue(argsObj.getEp2Object(), ep2Field, fieldValue, argsObj.isEp2BadgerFishStyle());
                }
            }
        };

    callback[CB.EP2TOEP1] =
        function(argsObj) {
            var ep1Field = argsObj.getEp1Field();
            if (ep1Field) {
                var ep1Obj = __get_wrapper(argsObj.getEp1Object(), argsObj, true);
                var ep2Obj = __get_wrapper(argsObj.getEp2Object(), argsObj, false);
                var fieldValue = this.evalHandler(argsObj, ep1Obj, ep2Obj);
                if (fieldValue != null) {
                    __setObjectFieldValue(argsObj.getEp1Object(), ep1Field, fieldValue, argsObj.isEp1BadgerFishStyle());
                }
            }
        };

    callback.evalHandler = function(argsObj, ep1Obj, ep2Obj) {
        var executor = this.createExecutor(argsObj, ep1Obj, ep2Obj);
        var p = this.parser;
        var v = '';
        var rst = null;
        try {
            while (p) {
                v += p.process(executor);
                p = p.next;
            }
            v = __restoreKeys(v);
            rst = executor._exec(v);
        } catch (ex) {
            log.error("exception occured in evalCallback: \n" +
                "expression = " + v + "\n" +
                "exception: " + ex
            );
        }
        return rst;
    };

    return callback;
}

function __createSMBDMEvalCallback() {
    var callback = __createDefaultEvalCallback();

    //@verride callback[ CB.EP2TOEP1 ]
    callback[CB.EP2TOEP1] = function(argsObj) {
        var smField = argsObj.getSMField();
        var smObj = __get_wrapper(argsObj.getSMObject(), argsObj, true);
        var bdmObj = __get_wrapper(argsObj.getBDMObject(), argsObj, false);
        var fieldValue = this.evalHandler(argsObj, smObj, bdmObj);
        if (smField && fieldValue != null) {
            fieldValue = __trans2ArrayDependsOnSM(argsObj, fieldValue);
            __setObjectFieldValue(argsObj.getSMObject(), smField, fieldValue, false);
        }
    };

    // set executor
    callback.createExecutor = createSMBDMExecutor;

    return callback;
}

function __get_wrapper(targetObj, argsObj, bEp1Obj) {
    return {
        value: function(field) {

            return __getObjectFieldValue(targetObj, this.__getFieldName(field),
                bEp1Obj ? argsObj.isEp1BadgerFishStyle() : argsObj.isEp2BadgerFishStyle());
        },

        setValue: function(value, field) {
            if (!field) {
                field = bEp1Obj ? argsObj.getEp1Field() : argsObj.getEp2Field();
            }
            __setObjectFieldValue(targetObj, field, value,
                bEp1Obj ? argsObj.isEp1BadgerFishStyle() : argsObj.isEp2BadgerFishStyle());
        },

        setObjectValue: function(obj, field) {
            if (!field) {
                field = bEp1Obj ? argsObj.getEp1Field() : argsObj.getEp2Field();
            }
            __setObjectFieldValue(targetObj, field, obj, false);
        },

        __getFieldName: function(field) {
            if (field) {
                var bBadgerFishStyle = false;
                if (bEp1Obj) {
                    bBadgerFishStyle = argsObj.isEp1BadgerFishStyle();
                } else {
                    bBadgerFishStyle = argsObj.isEp2BadgerFishStyle();
                }
                if (bBadgerFishStyle) {
                    var mappingHandler = argsObj.getMappingHandler();
                    var mappingMetaInfo = mappingHandler.getMappingMetaInfo(DIRECTION.EP1TOEP2);
                    var xmlnsObj = bEp1Obj ? mappingMetaInfo.getEp1XmlnsObject() : mappingMetaInfo.getEp2XmlnsObject();
                    field = util_expandPrefixWithNS(xmlnsObj, field);
                }
            } else {
                field = bEp1Obj ? (argsObj.isEp1BadgerFishStyle() ? argsObj.getEp1QField() : argsObj.getEp1Field()) :
                    (argsObj.isEp2BadgerFishStyle() ? argsObj.getEp2QField() : argsObj.getEp2Field());
            }

            return field;
        }

    };
}


//
//--- assist functions -------------------------------
//
function __getObjectFieldValue(obj, field, bBadgerFishStyle) {
    if (typeof bBadgerFishStyle != 'undefined' && bBadgerFishStyle == true) {
        return util_getObjectQFieldValue(obj, field);
    } else {
        return util_getObjectFieldValue(obj, field);
    }
}

function __setObjectFieldValue(obj, field, value, bBadgerFishStyle) {

    if (typeof bBadgerFishStyle != 'undefined' && bBadgerFishStyle == true) {
        var arrCheck = util_isArray(value);
        if (arrCheck[0]) {
            var i;
            for (i = 0; i < arrCheck[1]; i++) {
                if (value[i] != null) {
                    util_setObjectFieldValue(obj, __tailTextNode(field + '[' + i + ']'), value[i]);
                }
            }
        } else {
            util_setObjectFieldValue(obj, __tailTextNode(field), value);
        }
    } else {
        util_setObjectFieldValue(obj, field, value);
    }
}

function __trans2ArrayDependsOnSM(argsObj, targetFieldValue) {
    if (argsObj.isSMFieldArray() && !util_isArray(targetFieldValue)[0]) {
        if (targetFieldValue != null) {
            targetFieldValue = [targetFieldValue];
        }
    }
    return targetFieldValue;
}

function __tailTextNode(field) {
    var idx = field.lastIndexOf('/');
    if (idx < 0) {
        idx = 0;
    } else {
        idx += 1;
    }
    return (field.charAt(idx) == '@' ? field : field + "/$");
}