var log = getLog("BaseDAO");
//log.setLevel("debug");
var Class = lib.Prototype.getClass();
var dao = {};

dao.BasicDAO = Class.create(lib.BaseObject.getClass(), {

    initialize: function($super, name) {
        $super();
        this.tableName = name;
        this.scFile = new SCFile(name);
        this.updateCondition = "";
    },

    setMappingHandler: function(mappingHandler) {
        this.mappingHandler = mappingHandler;
    },

    setKeyField: function(name) {
        this.keyField = name;
    },

    getKeyField: function() {
        return this.keyField;
    },

    getKeyFields: function() {
        return [this.keyField];
    },

    identifierInfo: function() {
        return "id=" + this.scFile.id;
    },

    findById: function(id) {
        var rc = this.scFile.doSelect("number=\"" + id + "\"");
        if (rc == RC_SUCCESS) {
            if (log.isDebugEnabled()) {
                log.debug("find");
            }
        } else if (rc == RC_NO_MORE) {
            if (log.isDebugEnabled()) {
                log.debug(this.getClassName() + " not find any record");
            }
            return false;
        } else {
            throw new Error("unknown error, return code = " + rc);
        }
        return true;
    },

    getSCFile: function() {
        return this.scFile;
    },

    /**
     * @returns false if not find, otherwise return the true, result is in getSCFile()
     */
    search: function(obj) {
        var query = [];
        var f;
        for (f in obj) {
            if (obj[f] == null) {
                continue;
            }

            var isStr = false;
            query.push(f);
            query.push("=");
            if (typeof(obj[f]) == "string") {
                isStr = true;
                query.push("\"");
            }
            query.push(obj[f]);
            if (isStr) {
                query.push("\"");
            }
        }

        this.scFile = new SCFile(this.tableName);
        var code = this.scFile.doSelect(query.join(""));
        if (code == RC_SUCCESS) {
            if (log.isDebugEnabled()) {
                log.debug("find " + this.identifierInfo());
            }
            return true;
        } else if (code == RC_VALIDATION_FAILED) {
            throw new ValidationFailedException(this.tableName, "failed to doSelect ");
        } else if (code == RC_NOT_AUTHORIZED) {
            throw new AuthorizationException(this.tableName, "doSelect");
        } else {
            return false;
        }
    },

    getString: function(name) {
        return this.scFile[name];
    },

    getFieldValue: function(name) {
        return this.scFile[name];
    },

    getFieldJsObj: function(name) {
        var v = this.getFieldValue(name);
        if ((v.getType instanceof Function) && v.getType() == "ARRAY") {
            return v.toArray();
        } else {
            return this.scFile[name];
        }
    },

    remove: function(obj) {
        var query = [];
        var f;
        for (f in obj) {
            var isStr = false;
            query.push(f);
            query.push("=");
            if (typeof(obj[f]) == "string") {
                isStr = true;
                query.push("\"");
            }
            query.push(obj[f]);
            if (isStr) {
                query.push("\"");
            }
        }

        var code = this.scFile.doSelect(query.join(""));
        while (code == RC_SUCCESS) {
            if (log.isDebugEnabled()) {
                log.debug("remove " + this.identifierInfo());
            }
            if (!this.isUpdatable()) {
                this.scFile.doRemove();
            }
            code = this.scFile.getNext();
        }
    },

    /**
     * @param obj if obj must contains the key field of the SM table
     */
    update: function(objFind, objUpdate, appendFields) {
        if (appendFields) {
            return this._update(objFind, appendFields);
        } else {
            return this.findAndUpdate(objFind, objUpdate);
        }
    },

    _update: function(objUpdate, appendFields) {
        if (log.isDebugEnabled()) {
            log.debug("to update " + JSON.stringify(objUpdate));
        }

        var f;
        for (f in objUpdate) {
            if (this.scFile[f] != null && this.scFile[f].getType && this.scFile[f].getType() == "ARRAY") {
                if (log.isDebugEnabled()) {
                    log.debug("array field " + f + " value " + JSON.stringify(objUpdate[f]));
                }
                if (!(objUpdate[f] instanceof Array)) {
                    this.appendFieldValue([objUpdate[f]]);
                } else if (appendFields != null && f in appendFields) {
                    if (log.isDebugEnabled()) {
                        log.debug("append field " + f);
                    }
                    this.appendFieldValue(f, objUpdate[f]);
                } else {
                    this.setFieldValue(f, objUpdate[f]);
                }
            } else {
                this.setFieldValue(f, objUpdate[f]);
            }
        }

        if (log.isDebugEnabled()) {
            log.debug("pre update: " + this.getFieldValue("update.action"));
        }

        var G_bg_activity_text_bak = vars.$G_bg_activity_text;
        var G_bg_activity_type_bak = vars.$G_bg_activity_type;
        vars.$G_bg_activity_text = null;
        vars.$G_bg_activity_type = null;

        if (!this.isUpdatable()) {
            var rc = this.scFile.doAction("save");
            vars.$G_bg_activity_text = G_bg_activity_text_bak;
            vars.$G_bg_activity_type = G_bg_activity_type_bak;

            if (rc == RC_SUCCESS) {
                return true;
            } else {
                var msg = this.getActionMessage();
                if (msg) {
                    log.error(msg);
                }

                if (rc == RC_VALIDATION_FAILED) {
                    throw new ValidationFailedException(this.tableName, "failed to update record " + this.scFile[this.getKeyField()]);
                } else if (rc == RC_NOT_AUTHORIZED) {
                    throw new AuthorizationException(this.tableName, "update");
                } else if (rc == RC_MODIFIED) {
                    msg = RCtoString(rc);
                    log.info(msg);
                    throw new RecordModifiedException(this.tableName, this.getFieldValue(this.getKeyField()), msg);
                } else if (rc == RC_CANT_HAVE) {
                    msg = RCtoString(rc);
                    log.info(msg);
                    throw new ResourceInUseException(this.tableName, this.getFieldValue(this.getKeyField()), msg);
                }
                throw new Error("DAO error code=" + RCtoString(rc));
            }
        }
    },

    appendActivityLog: function(objFind, logText) {
        var find = this.search(objFind);
        if (!find) {
            throw new Error("Record does not exist.");
        }

        vars.$pmc_actions = logText;
        if (log.isDebugEnabled()) {
            log.debug("logText = " + vars.$pmc_actions);
        }

        var G_bg_activity_text_bak = vars.$G_bg_activity_text;
        var G_bg_activity_type_bak = vars.$G_bg_activity_type;
        vars.$G_bg_activity_text = null;
        vars.$G_bg_activity_type = null;

        if (!this.isUpdatable()) {
            var rc = this.scFile.doAction("save");

            vars.$G_bg_activity_text = G_bg_activity_text_bak;
            vars.$G_bg_activity_type = G_bg_activity_type_bak;

            if (rc == RC_SUCCESS) {
                return true;
            } else {
                var msg = this.getActionMessage();
                if (msg) {
                    log.error(msg);
                }

                if (rc == RC_VALIDATION_FAILED) {
                    throw new ValidationFailedException(this.tableName, "failed to update activities " + this.scFile[this.getKeyField()]);
                } else if (rc == RC_NOT_AUTHORIZED) {
                    throw new AuthorizationException(this.tableName, "update activities");
                } else if (rc == RC_MODIFIED) {
                    msg = RCtoString(rc);
                    log.info(msg);
                    throw new RecordModifiedException(this.tableName, this.getFieldValue(this.getKeyField()), msg);
                } else if (rc == RC_CANT_HAVE) {
                    msg = RCtoString(rc);
                    log.info(msg);
                    throw new ResourceInUseException(this.tableName, this.getFieldValue(this.getKeyField()), msg);
                }
                throw new Error("DAO error code=" + RCtoString(rc));
            }
        }
    },

    findAndUpdate: function(objFind, objUpdate) {
        var find = this.search(objFind);
        if (find) {
            return this._update(objUpdate);
        }
        return false;
    },

    /**
     * @param value can be a complex structure or array
     */
    setFieldValue: function(fieldName, value) {
        this._setFieldValue(this.scFile, fieldName, value, false);
    },

    /**
     * if SCFile fieldName is an array type field, the parameter 'value' must 
     * also be a javascript array object
     */
    appendFieldValue: function(fieldName, value) {
        this._setFieldValue(this.scFile, fieldName, value, true);
    },

    _setFieldValue: function(scFile, fieldName, value, isAppend) {
        var type = typeof(value);
        if (type == "object") {
            if (value instanceof Array) {
                if (scFile[fieldName] == null) {
                    if (log.isDebugEnabled()) {
                        log.debug("field " + fieldName + " is null, to create a new array");
                    }
                    scFile[fieldName] = value;
                } else {
                    var i;
                    if (isAppend) {
                        for (i = 0; i < value.length; i++) {
                            var numOfEntry = scFile[fieldName].length();
                            if (numOfEntry == 1) {
                                numOfEntry = scFile[fieldName].toArray().length;
                            }
                            if (log.isDebugEnabled()) {
                                log.debug("append field " + fieldName + " @ " + numOfEntry);
                            }
                            this._setFieldValue(scFile[fieldName], numOfEntry, value[i], false);
                        }
                    } else {
                        //QCCR60494 String duplication in Event, use flag to override the list if _appendToLog is false
                        if (this.mappingHandler != null && this.mappingHandler.mappingContext != null) {
                            var isAppendToArray = this.mappingHandler.mappingContext.get(fieldName + "_appendToArray");
                            if (isAppendToArray != undefined && !isAppendToArray) { //only handle _appendToArray=false flag to avoid change the current scenario
                                scFile[fieldName] = []; //change to empty to allow the new value override
                            }
                        }
                        for (i = 0; i < value.length; i++) {
                            this._setFieldValue(scFile[fieldName], i, value[i], isAppend);
                        }
                    }
                }
            } else if (value instanceof Date) {
                scFile[fieldName] = value;
            } else { //structure
                if (scFile[fieldName] == null) {
                    if (log.isDebugEnabled()) {
                        log.debug("field " + fieldName + " is null, to create a new structure");
                    }
                    scFile[fieldName] = value;
                } else {
                    var f;
                    for (f in value) {
                        this._setFieldValue(scFile[fieldName], f, value[i], isAppend);
                    }
                }
            }
        } else {
            scFile[fieldName] = value;
        }
    },

    /**
     * create record
     *
     * @param {Object} obj
     * @returns {Boolean}
     */
    save: function(obj) {
        this.scFile = new SCFile(this.tableName);
        if (log.isDebugEnabled()) {
            log.debug("create " + JSON.stringify(obj));
        }

        var f;
        for (f in obj) {
            this.setFieldValue(f, obj[f]);
        }
        var rc;

        if (!this.isUpdatable()) {
            rc = this.scFile.doAction("addsave");
            if (log.isDebugEnabled()) {
                log.debug("addsave success = " + RCtoString(rc));
            }

            if (rc != RC_SUCCESS) {
                var msg = this.getActionMessage();
                if (msg) {
                    log.error(msg);
                }
                if (rc == RC_VALIDATION_FAILED) {
                    throw new ValidationFailedException(this.tableName, "failed to add record");
                } else if (rc == RC_NOT_AUTHORIZED) {
                    throw new AuthorizationException(this.tableName, "add");
                } else {
                    throw new Error("DAO error code=" + RCtoString(rc));
                }
            }
        }

        return rc == RC_SUCCESS;
    },

    /**
     * returns message from previous SCFile.doAction() call.
     *
     * @returns {String}
     */
    getActionMessage: function() {
        var messages = this.scFile.getMessages();
        if (messages && messages[0]) {
            return messages[0];
        }

        return null;
    },

    parseString: function() {
        var s = [];
        s.push(this.getClassName());
        var f;
        for (f in this.scFile) {
            s.push(f);
            s.push(" ");
        }
        return s.join("");
    },

    getClassName: function() {
        return "dao.BasicDAO";
    },

    isUpdatable: function() {
        if (!this.updateCondition) {
            return false;
        }

        try {
            return eval(this.updateCondition);
        } catch (e) {
            return false;
        }
    }
});

function AuthorizationException(objectName, operation) {
    this.objectName = objectName;
    this.operation = operation;
    this.name = "AuthorizationException";
    this.message = "Not Authorized for operation " + operation + " on " + objectName;
}
AuthorizationException.prototype = Error.prototype;

function ValidationFailedException(objectName, message) {
    this.objectName = objectName;
    this.name = "ValidationFailedException";
    this.message = "Validation failed for " + objectName + " - " + message;
}
ValidationFailedException.prototype = Error.prototype;

function ResourceInUseException(objectName, key, msg) {
    this.className = "ResourceInUseException";
    this.objectName = objectName;
    this.key = key;
    this.message = msg + " file: " + this.objectName + ", key: " + key;
}
ResourceInUseException.prototype = Error.prototype;

function RecordModifiedException(objectName, key, msg) {
    this.className = "RecordModifiedException";
    this.objectName = objectName;
    this.key = key;
    this.message = msg + " file: " + this.objectName + ", key: " + key;
}
RecordModifiedException.prototype = Error.prototype;


function getClass() {
    return dao.BasicDAO;
}