var log = getLog("BDM_SM");
//
//-- cache for improving performance -------------------
//
var json2xml = lib.XML_JSON.json2xml;
var bzInterface = lib.BDMSMInterface;
var createMappingHandler = lib.BDM_Mapping.createMappingHandler;
var createMappingContext = lib.BDM_Mapping.createMappingContext;
var SMOMi_setSmMgrIdToContext = lib.SMOMi.setSmMgrIdToContext;
var ResourceInUseException = lib.BasicDAO.ResourceInUseException;
var RecordModifiedException = lib.BasicDAO.RecordModifiedException;
//
//-- cache datas ---------------------------------------
//

var INCIDENT_ID_PREFIX = "urn:x-hp:software:servicemanager:incident:id:";

function createRequestHandler(mappingHandler) {
    return __createRequestHandler(mappingHandler);
}

function processRequest(args, inXML, attachmentArray) {
    var ret = null;
    if (log.isDebugEnabled()) {
        log.debug("BDM_SM.processRequest invoked with " + args);
    }
    var G_bg_save = vars.$G_bg;
    vars.$G_bg = true;
    try {
        if (log.isDebugEnabled()) {
            log.debug("processRequest() args= " + args);
        }
        args = eval('(' + args + ')');
        if (args.BDMVersion == null) {
            args.BDMVersion = "1.1";
        }

        var mappingContext = createMappingContext();
        mappingContext.setVersion(args.BDMVersion);
        mappingContext.setObjectName(args.ObjectName);
        SMOMi_setSmMgrIdToContext(mappingContext);
        var requestHandler = createRequestHandler(createMappingHandler(mappingContext));
        var f = requestHandler[args.Operation];
        if (f != null && typeof f == 'function') {
            ret = f.call(requestHandler, args, inXML, attachmentArray);
        } else {
            throw new UnsupportedOperationException(args.Operation);
        }

        if (log.isDebugEnabled()) {
            log.debug("processRequest finished for " + args.Operation);
            log.debug(" return xml : " + ret);
        }

        return ret;
    } catch (e) {
        throw e;
    } finally {
        vars.$G_bg = G_bg_save;
    }
}

function __createRequestHandler(_mappingHandler) {
    var requestHandler = {

        mappingHandler: _mappingHandler,

        RetrieveById: function(args) {
            var id = args.Key;
            var origId = id;
            id = id.after(INCIDENT_ID_PREFIX);
            var query = 'id= "' + id + '"';
            if (log.isDebugEnabled()) {
                log.debug("query=" + query);
            }
            var SMObj = this.getSMObject(query);
            if (SMObj == null) {
                return "<NOT_FOUND/>";
            }
            var o = this.mappingHandler.SMToBDM(SMObj);
            var result = json2xml(o, "");
            return result;
        },

        RetrieveByReferenceNumber: function(args) {
            var refNumber = args.Key;
            var SMObj = this.getSMObject('number = "' + refNumber + '"');
            if (SMObj == null) {
                return "<NOT_FOUND/>";
            }
            var o = this.mappingHandler.SMToBDM(SMObj);
            return json2xml(o, "");
        },

        StartQuery: function(args) {
            return __startQuery(args.ObjectName, args.Query, parseInt(args.PageSize, 10), this);
        },

        ContinueQuery: function(args) {
            var o = __continueQuery(args.ObjectName, this);
            return json2xml(o, "");
        },

        GetQueryResultItems: function(args) {
            var o = __getQueryResultItems(args.ObjectName, parseInt(args.StartIndex, 10), parseInt(args.Count, 10), this);
            return json2xml(o, "");
        },

        Create: function(args, inXML) {
            var mctx = this.mappingHandler.mappingContext;
            mctx.setOperation(mctx.CREATE);
            var o = bzInterface.createResource(args.ObjectName, inXML, this.mappingHandler);
            return json2xml(o, "");
        },

        CreateAttachment: function(args, inXML, attachmentArray) {
            var objectName = args.ObjectName.substring(0, 1).toUpperCase() + args.ObjectName.substring(1);
            var DAO = lib.SMDAOFactory.getDAO(objectName);
            var dao = new DAO();
            var queryObj = {};
            queryObj[dao.getKeyField()] = args.Key;
            var find = dao.search(queryObj);
            if (!find) {
                throw new RecordNotFoundException(args.ObjectName, args.Key);
            }
            var att = attachmentArray.shift();
            if (log.isDebugEnabled()) {
                log.debug("CreateAttachment() Attachment:", att.href, "Name:", att.name, "Len:", att.len, "Type:", att.type);
            }
            var uuid = dao.scFile.insertAttachment(att);
            attachmentArray.slice(0, attachmentArray.length);
            if (log.isDebugEnabled()) {
                log.debug("CreateAttachment() " + uuid + " is created");
            }
            return uuid;
        },

        UpdateAttachment: function(args, inXML, attachmentArray) {
            var att = attachmentArray.shift();
            if (log.isDebugEnabled()) {
                log.debug("UpdateAttachment() Attachment:", att.href, "Name:", att.name, "Len:", att.len, "Type:", att.type);
            }
            var objectName = args.ObjectName.substring(0, 1).toUpperCase() + args.ObjectName.substring(1);
            var DAO = lib.SMDAOFactory.getDAO(objectName);
            var dao = new DAO();
            var queryObj = {};
            queryObj[dao.getKeyField()] = args.Key;
            var find = dao.search(queryObj);
            if (!find) {
                throw new RecordNotFoundException(args.ObjectName, args.Key);
            }

            if (dao.isUpdatable()) {
                return att.href;
            }

            var rc = dao.scFile.updateAttachment(att);
            if (rc == RC_NO_MORE) {
                throw new AttachmentNotFoundException(args.ObjectName, args.Key, args.AttachmentID);
            }
            return rc;
        },

        DeleteAttachment: function(args, inXML, attachmentArray) {
            var objectName = args.ObjectName.substring(0, 1).toUpperCase() + args.ObjectName.substring(1);
            var DAO = lib.SMDAOFactory.getDAO(objectName);
            var dao = new DAO();
            var queryObj = {};
            queryObj[dao.getKeyField()] = args.Key;
            var find = dao.search(queryObj);
            if (!find) {
                throw new RecordNotFoundException(args.ObjectName, args.Key);
            }

            if (dao.isUpdatable()) {
                return att.href;
            }

            if (log.isDebugEnabled()) {
                log.debug("DeleteAttachment() to delete id :" + args.AttachmentID);
            }
            var rc = dao.scFile.deleteAttachment(args.AttachmentID);
            if (rc == RC_NO_MORE) {
                throw new AttachmentNotFoundException(args.ObjectName, args.Key, args.AttachmentID);
            }
            return rc;
        },

        GetAttachment: function(args, inXML, attachmentArray) {
            var objectName = args.ObjectName.substring(0, 1).toUpperCase() + args.ObjectName.substring(1);
            var DAO = lib.SMDAOFactory.getDAO(objectName);
            var dao = new DAO();
            var queryObj = {};
            queryObj[dao.getKeyField()] = args.Key;
            var find = dao.search(queryObj);
            if (!find) {
                throw new RecordNotFoundException(args.ObjectName, args.Key);
            }
            attachmentArray.slice(0, attachmentArray.length);
            var att = dao.scFile.getAttachment(args.AttachmentID);
            if (att == null) {
                throw new AttachmentNotFoundException(args.ObjectName, args.Key, args.AttachmentID);
            }
            if (log.isDebugEnabled()) {
                log.debug("GetAttachment() Attachment:", att.href, "Name:", att.name, "Len:", att.len, "Type:", att.type);
            }
            attachmentArray.push(att);
            if (log.isDebugEnabled()) {
                log.debug("GetAttachment() end");
            }
            return args.AttachmentID;
        },

        GetAllAttachments: function(args, inXML, attachmentArray) {
            if (log.isDebugEnabled()) {
                log.debug("GetAllAttachments() " + args.ObjectName);
            }
            var objectName = args.ObjectName.substring(0, 1).toUpperCase() + args.ObjectName.substring(1);
            var DAO = lib.SMDAOFactory.getDAO(objectName);
            var dao = new DAO();
            var queryObj = {};
            queryObj[dao.getKeyField()] = args.Key;
            var find = dao.search(queryObj);
            if (!find) {
                throw new RecordNotFoundException(args.ObjectName, args.Key);
            }
            var attachments = dao.scFile.getAttachments();
            attachmentArray.slice(0, attachmentArray.length);
            while (attachments.length > 0) {
                var att = attachments.shift();
                if (log.isDebugEnabled()) {
                    log.debug("Attachment:", att.href, "Name:", att.name, "Len:", att.len, "Type:", att.type); // Cannot log.debug value property
                }
                attachmentArray.push(att);
            }
            return args.Key;
        },

        Update: function(args, inXML) {
            try {
                var mctx = this.mappingHandler.mappingContext;
                mctx.setOperation(mctx.UPDATE);
                var o = bzInterface.updateResource(args.ObjectName, inXML, this.mappingHandler);
                return json2xml(o, "");
            } catch (e) {
                if (e.className == "ResourceInUseException") {
                    log.info(e.message);
                    return "<RESOUCE_IN_USE/>";
                } else if (e.className == "RecordModifiedException") {
                    log.info(e.message);
                    return "<RECORD_MODIFIED/>";
                } else {
                    throw e;
                }
            }
        },

        appendActivityLog: function(args, inXML) {
            try {
                var mctx = this.mappingHandler.mappingContext;
                mctx.setOperation(mctx.UPDATE);
                var o = bzInterface.appendActivityLog(args.ObjectName, inXML, this.mappingHandler);
                return json2xml(o, "");
            } catch (e) {
                if (e instanceof ResourceInUseException) {
                    log.info(e.message);
                    return "<RESOUCE_IN_USE/>";
                } else if (e instanceof RecordModifiedException) {
                    log.info(e.message);
                    return "<RECORD_MODIFIED/>";
                } else {
                    throw e;
                }
            }
        },

        getAtomMappingFields: function(args) {
            var atomMappingFields = {};
            atomMappingFields['atom-mappings'] = this.mappingHandler.extractAtomMappingFields();
            return json2xml(atomMappingFields, "");
        },

        getCategoryMapping: function(args) {
            if (log.isDebugEnabled()) {
                log.debug("getCategoryMapping()");
            }
            var categories = this.mappingHandler.mappingConfigObject.atomCategories;
            var categoriesObj = {};
            var mapping = this.mappingHandler.mappingConfigObject.getMapping();

            var xml = ["<catdef>\n"];
            var i;
            for (i in categories) {
                categoriesObj[categories[i]] = [];
            }

            var valueGps = {};
            for (i in mapping) {
                var bdmField = mapping[i].fileRecord[1];
                if (bdmField in categoriesObj) {
                    var valueGp = mapping[i].fileRecord[8];
                    valueGps[valueGp] = categoriesObj[bdmField];
                }
            }

            var valueMapping = this.mappingHandler.mappingConfigObject.valueMapping;
            for (i in valueMapping) {
                if (valueMapping[i][2] in valueGps) {
                    categories = valueGps[valueMapping[i][2]];
                    categories.push(valueMapping[i][0]);
                }
            }

            for (i in categoriesObj) {
                xml.push("<catgories field=\"");
                xml.push(i);
                xml.push("\">\n");
                var c;
                for (c in categoriesObj[i]) {
                    xml.push("\t<category><![CDATA[");
                    xml.push(categoriesObj[i][c]);
                    xml.push("]]></category>\n");
                }
                xml.push("</catgories>\n");
            }
            xml.push("</catdef>");

            return xml.join("");
        },

        getSMObject: function(query) {
            var f = new SCFile(this.mappingHandler.SMFileForEntity());
            var rc = f.doSelect(query);
            if (rc == RC_SUCCESS) {
                // Make sure we have an id assigned
                if (f.id == null) {
                    // This SM object does not yet have a UUID, so generate one and do an update
                    assignUUID(f);
                }

                return f;
            }
            return null;
        },

        getSMObjectList: function(query) {
            var rl = new RecordList(this.mappingHandler.SMFileForEntity(), query);

            var i;
            for (i in rl) {
                if (rl[i].id == null) {
                    // This SM object does not yet have a UUID, so generate one and do an update
                    assignUUID(rl[i]);
                }
            }

            return rl;
        }
    };

    return requestHandler;
}

function BQLParserException(message) {
    this.name = "BQLParserException";
    this.message = "BDM query errors : " + message;
}
BQLParserException.prototype = Error.prototype;

function UnsupportedOperationException(operationName) {
    this.operationName = operationName;
    this.name = "UnsupportedOperationException";
    this.message = "Unsupported operation: " + operationName;
}
UnsupportedOperationException.prototype = Error.prototype;

function NoSuchObjectException(objectName, keyValue) {
    this.objectName = objectName;
    this.keyValue = keyValue;
    this.name = "NoSuchObjectException";
    this.message = "No such " + objectName + " - " + keyValue;
}
NoSuchObjectException.prototype = Error.prototype;

function AttachmentNotFoundException(objectName, keyValue, attachmentId) {
    this.objectName = objectName;
    this.keyValue = keyValue;
    this.name = "AttachmentNotFoundException";
    this.message = "Object " + objectName + " key - " + keyValue + " doesn't have attchment ID - " + attachmentId;
}
AttachmentNotFoundException.prototype = Error.prototype;

function RecordNotFoundException(objectName, keyValue) {
    this.objectName = objectName;
    this.keyValue = keyValue;
    this.name = "RecordNotFoundException";
    this.message = "Object " + objectName + " key - " + keyValue + " doesn't exist";
}
RecordNotFoundException.prototype = Error.prototype;


___recordLists___ = {};

function RecordListHolder(rl, objectName, query, pageSize) {
    this.rl = rl;
    this.objectName = objectName;
    this.query = query;
    this.pageSize = new Number(pageSize);
    this.browseStarted = false;
}

function __getQueryResultItems(objectName, oneBasedIndex, count, requestHandler) {
    if (oneBasedIndex < 1) {
        throw new Error("startIndex cannot be less than one");
    }

    var startIndex = oneBasedIndex - 1;

    if (___recordLists___[objectName] == undefined) {
        throw new Error("No recordlist exists - must do startQuery() before getQueryResultItems()");
    }

    var rlHolder = ___recordLists___[objectName];

    var rl = rlHolder.rl;

    if (startIndex > (rl.count() - 1)) {
        throw new Error("startIndex exceeds recordlist count");
    }

    if (((oneBasedIndex + count) - 1) > rl.count()) {
        throw new Error("requested range exceeds recordlist count");
    }

    var limit = Math.min(startIndex + count, rl.count());

    return __getQueryItems(rlHolder, startIndex, limit, requestHandler);
}

function __getQueryItems(rlHolder, startIndex, limit, requestHandler) {
    var rl = rlHolder.rl;
    var objectName = rlHolder.objectName;

    var index = 0;
    var list = objectName + "-list";

    var objTemp = {};
    objTemp[objectName] = [];
    var o = {};
    o[list] = objTemp;

    var i;
    for (i = startIndex; i < limit; i++) {
        if (rl[i].id == null) {
            // This SM object does not yet have a UUID, so generate one and do an update
            assignUUID(rl[i]);
        }

        var bdmObj = requestHandler.mappingHandler.SMToBDM(rl[i]);
        o[list][objectName][index] = bdmObj[objectName];

        index++;
    }

    return o;
}

function __startQuery(objectName, query, pageSize, requestHandler) {
    // Note: We deliberately use a global JS variable here, so that the recordlist state
    // is preserved across JS script executions from the DAO side
    var mappingHandler = requestHandler.mappingHandler;
    var smQuery;
    if (query == null || query == "" || query == "true") {
        smQuery = "true";
    } else {
        var parser = new lib.BQLPARSE.BDMQueryParser();
        smQuery = parser.parse(mappingHandler, query);
        if (smQuery == null) {
            throw new BQLParserException(parser.getErrorMessages());
        }
    }
    if (log.isDebugEnabled()) {
        log.debug("__startQuery() SM Query: " + smQuery);
    }
    var rl = new RecordList(mappingHandler.SMFileForEntity(), smQuery);

    ___recordLists___[objectName] = new RecordListHolder(rl, objectName, query, pageSize);

    return rl.count();
}

// Get up to numRecs more records from the result set
function __continueQuery(objectName, requestHandler) {
    var rlHolder;
    var rl;

    if (___recordLists___[objectName] == undefined) {
        throw new Error("No recordlist exists for " + objectName + " - must do startQuery() before continueQuery()");
    }

    rlHolder = ___recordLists___[objectName];

    rl = rlHolder.rl;

    var curPos = rl.getPosition();
    var totalRecs = rl.count();
    var pageSize = rlHolder.pageSize;

    // See if we have already retrieved all the records in the list.
    if (curPos == rl.count() - 1) {
        return null;
    }

    // Recordlist position starts at zero and is left at the last position
    // retrieved. This means we have to increment it ourselves.
    // However, since pageSize could be 1, we need a separate variable, which we keep in the RecordListHolder

    if (rlHolder.browseStarted) {
        curPos++;
    } else {
        rlHolder.browseStarted = true;
    }

    var limit = Math.min(curPos + pageSize, totalRecs);

    var ol = __getQueryItems(rlHolder, curPos, limit, requestHandler);

    return ol;
}


// This function updates the "id" column of the given record to assign a unique UUID
//
// Note that we do NOT store the invariant urn string prefix. We store only the RFC-defined UUID.
// That is because we would experience SQL truncation if we tried to store the long Symphony-defined urn string too.
function assignUUID(f) {
    f.id = lib.UUID.generateUUID();

    var r = f.doUpdate();

    // Regrettably, the RecordList object still uses the old behavior of returning true / false rather than an RC value :-(
    // So sometimes this routine will be passed a record which is a Datum object rather than an SCDatum.
    // This complicates testing for success or failure of doUpdate()

    if ((typeof r == "number" && r != RC_SUCCESS) // "f" is an SCFile-derived object
        ||
        (typeof r == "boolean" && !r)) // "f" is a RecordList-derived object
    {
        throw new Error("Unable to assign BDM id to " + " code =" + RCtoString(r) + f);
    }
}

// Add a "before" method to Javascript string object
String.prototype.before = function(str) {
    var strIntern = this.valueOf();

    var strLen = str.length;

    var i = strIntern.indexOf(str);

    if (i >= 0) {
        return strIntern.substring(0, i);
    }
    return "";
};

// Add an "after" method to Javascript string object
String.prototype.after = function(str) {
    var strIntern = this.valueOf();

    var strLen = str.length;

    var i = strIntern.indexOf(str);

    if (i >= 0) {
        return strIntern.substr(i + strLen);
    }
    return "";
};

function dumpObject(obj) {
    var prop;
    for (prop in obj) {
        if (typeof obj[prop] == "object") {
            if (log.isDebugEnabled()) {
                log.debug(prop);
            }
            dumpObject(obj[prop]);
        } else {
            if (log.isDebugEnabled()) {
                log.debug(prop, ":", obj[prop]);
            }
        }
    }
}

// Sets current timezone to UTC with YYYY-MM-DD date format
function setStandardDateTimeSettings() {
    var f = new SCFile("tzfile");

    if (f.doSelect('name = "BTO Data Model"') == RC_SUCCESS) {
        funcs.set_timezone(f);
    }
}


// Sets the current timezone
function setCurrentTimezone(tzname) {
    var f = new SCFile("tzfile");

    if (f.doSelect('name = "' + tzname + '"') == RC_SUCCESS) {
        funcs.set_timezone(f);
    } else {
        throw ("Invalid timezone name: " + tzname);
    }
}

// Returns the currently configured timezone
function getCurrentTimezone() {
    // See if there are any operator-specific timezone or date order settings
    var f = new SCFile("operator", SCFILE_READONLY);
    f.setFields("time.zone");

    if (f.doSelect('name = "' + system.user.name + '"') == RC_SUCCESS) {
        if (f.time_zone != null) {
            return f.time_zone;
        }

        // No operator timezone setting, obtain the company-wide timezone
        f = new SCFile("info", SCFILE_READONLY);
        f.setFields("time.zone");

        if (f.doSelect('type = "company"') == RC_SUCCESS) {
            return f.time_zone;
        }
    }

    return null;
}