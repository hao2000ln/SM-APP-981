var log = getLog('rest.attachment');
var restRC = lib.RestfulConstant.getReturnCode();

function processAttachment(options, uri, attachmentArray, config) {
    try {
        var method = options.method;
        var resource = uri[0];
        if (config['rest.attachment.enabled'] != true) {
            return lib.RestfulMain.makeErrorMsg(restRC['badval'], funcs.scmsg('10', 'restful', [resource]));
        }

        var attachmentId = uri[config.rest_keys.length() + 2];

        var dbdict = lib.RestfulMain.getdbdict(config.name);

        var keyValues = uri.slice(1);

        var queryFields = lib.RestfulQuery.resolveQueryFields(null, keyValues, config, dbdict);
        if (queryFields[0].length > 0) {
            return lib.RestfulMain.makeErrorMsg(restRC['badval'], funcs.scmsg('8', 'restful', [queryFields[0].toString()]));
        }

        var file = new SCFile(config['name'], SCFILE_READONLY);

        var query = queryFields[1];

        //var count = file.doCount(query);
        var count = checkCountMoreThanTwo(file, query);
        //log.info("processAttachment query2:"+config['name']+" with:"+query+" return:"+count);
        if (count > 1) {
            return lib.RestfulMain.makeErrorMsg(restRC['badval'], funcs.scmsg('26', 'scxmlapi'));
        } else if (count == 0) {
            return lib.RestfulMain.makeErrorMsg(restRC['no.record'], funcs.scmsg('330', 'scjsdesc'));
        }

        //file.setFields(config.rest_keys.toArray()); //for checking privilege, all fields should be selected out
        file.doSelect(query);

        var ret = attachmentEngine(file, attachmentId, attachmentArray, method, config, options.isnew);

        if (ret.returnCode == restRC['success']) {
            if ((method == 'GET' || method == 'DELETE') && attachmentId == null) {
                var array = [];
                var attachments = ret.file;
                count = 0;
                var i;
                for (i = 0; i < attachments.length; i++) {
                    array.push(attachment2Object(attachments[i]));
                    count++;
                }
                ret.count = count;
                if (count != 0) {
                    return lib.RestfulMain.toJson(array, ret, true, 'attachment', 1);
                } else {
                    ret.returnCode = restRC['no.attachment'];
                    return lib.RestfulMain.makeErrorMsg(ret.returnCode, ret.message, true);
                }
            } else {
                var obj = attachment2Object(ret.file);
                return lib.RestfulMain.toJson(obj, ret, false, 'attachment');
            }
        } else {
            return lib.RestfulMain.makeErrorMsg(ret.returnCode, ret.message);
        }
    } catch (ex) {
        return lib.RestfulMain.makeErrorMsg(restRC['error'], ex);
    }
}


/**
This function is a workaround to fix the count query in joinsvcDisplay table. 
If using doCount, the same catalog's attachment may return count number more than 2. Adding this function to return the correct count number.
**/
function checkCountMoreThanTwo(f, query) {
    var count = 0;
    var rc = f.doSelect(query);
    while (rc == 0 && count < 2) {
        count++;
        rc = f.getNext();
    }

    return count;
}

/**
 * CRUD attachment for REST API
 * @param {string} filename - table name
 * @param {string} query - Query statement against the file.  If user retrieves value by query, pass it through. If by id, the query should be constructed before calling this function to avoid additional search against dbdict
 * @param {array} ids - Unique of the table for better performance in select
 * @param {string} attachmentId - define attachment id for a single attachment.
 * @param {array} attachmentArray - attachment array of attachment objects.
 * @param {string} action - Attachment action. only 'get', 'put'(update), 'post'(create) & 'delete' are allowed.
 * @param {SCFile} config - extaccess
 * objectName - object name defined in extaccess
 **/
function attachmentEngine(file, attachmentId, attachmentArray, action, config, isnew) {
    var securityResult = checkAttachmentPrivilege(funcs.filename(file), file, action, config, isnew);
    if (securityResult != null) {
        return securityResult;
    }
    var attachmentObj = attachmentArray.shift();
    switch (action) {
        case "GET": //retrieve attachment
            if (attachmentId == null) {
                var attachments = file.getAttachments();
                return {
                    'returnCode': restRC['success'],
                    'file': attachments
                };
            } else {
                var att = file.getAttachment(attachmentId);
                if (att == null) {
                    return {
                        'returnCode': restRC['no.attachment'],
                        'message': funcs.scmsg('14', 'restful')
                    };
                }
                attachmentArray.push(att);

                return {
                    'returnCode': restRC['success'],
                    'file': att
                };
            }

            case "PUT": //update an attachment
                if (attachmentId == null) {
                    return {
                        'returnCode': restRC['badval'],
                        'message': funcs.scmsg('11', 'restful')
                    };
                }
                if (attachmentObj.type == null || attachmentObj.type == '') {
                    return {
                        'returnCode': restRC['badval'],
                        'message': funcs.scmsg('12', 'restful')
                    };
                }

                //check attachment exists or not
                var tmpAttachment = file.getAttachment(attachmentId);
                if (tmpAttachment == null) {
                    return {
                        'returnCode': restRC['no.attachment'],
                        'message': funcs.scmsg('14', 'restful')
                    };
                }
                attachmentObj.href = attachmentId;
                if (attachmentObj.name == null || attachmentObj.name == '') {
                    attachmentObj.name = tmpAttachment.name;
                }
                var uuid = file.updateAttachment(attachmentObj);
                var rc = getLastRC();
                if (uuid == null || rc != RC_SUCCESS) {
                    return {
                        'returnCode': restRC['badval'],
                        'message': funcs.scmsg('14', 'restful')
                    };
                }

                var att = file.getAttachment(uuid);

                return {
                    'returnCode': restRC['success'], 'file': att
                };

            case "POST": //add an attachment
                if (attachmentObj.type == null || attachmentObj.type == '') {
                    return {
                        'returnCode': restRC['badval'],
                        'message': funcs.scmsg('12', 'restful')
                    };
                }
                if (attachmentObj.name == null || attachmentObj.name == '') {
                    return {
                        'returnCode': restRC['badval'],
                        'message': funcs.scmsg('13', 'restful')
                    };
                }

                preProcess(file);
                var uuid = file.insertAttachment(attachmentObj);
                var rc = getLastRC();
                if (uuid != null && rc == RC_SUCCESS) {

                    postProcess(file);

                    var att = file.getAttachment(uuid);
                    return {
                        'returnCode': restRC['success'],
                        'file': att
                    };
                }

                return {
                    'returnCode': restRC['badval']
                };

            case "DELETE": //delete an attachment
                if (attachmentId == null) {
                    var attachments = file.getAttachments();
                    var array1 = _attachmentArray(attachments);

                    preProcess(file);
                    var deleteResult = file.deleteAttachments();
                    if (deleteResult == RC_NO_MORE) {
                        return {
                            'returnCode': restRC['no.attachment'],
                            'message': funcs.scmsg('14', 'restful')
                        };
                    }
                    var rc = getLastRC();
                    if (rc != RC_SUCCESS) {
                        return {
                            'returnCode': restRC['badval']
                        };
                    }

                    postProcess(file);

                    return {
                        'returnCode': restRC['success'],
                        'attachment': {},
                        'file': array1
                    };
                } else {
                    var att = file.getAttachment(attachmentId);
                    var attObj = null;
                    if (null != att) {
                        attObj = _attachment(att);
                    }

                    preProcess(file);
                    var deleteResult = file.deleteAttachment(attachmentId);
                    if (deleteResult == RC_NO_MORE) {
                        return {
                            'returnCode': restRC['no.attachment'],
                            'message': funcs.scmsg('14', 'restful')
                        };
                    }
                    var rc = getLastRC();
                    if (rc != RC_SUCCESS) {
                        return {
                            'returnCode': restRC['badval']
                        };
                    }

                    postProcess(file);

                    return {
                        'returnCode': restRC['success'],
                        file: attObj
                    };
                }

                default:
                    return {
                        'returnCode': restRC['invalid.action'], 'attachment': {}
                    };
    }

}


/**
 * Check if it is an attachment rest and get attachment id from uri.
 * @param {array} uri - uri input by user. [filename, id1 ...]
 * @param {string} method - method of rest api (post/put/delete/get)
 *
 * @return {array} - [code, attachmentId]
 **/
function getAttachmentIdInURI(uri, method, config) {
    var keyLength = config.rest_keys.length();

    if (uri[keyLength + 1] != "attachments") {
        return [1, 'invalid attachments uri'];
    }

    var attachmentId = uri[keyLength + 2];

    if (attachmentId == null && method == "PUT") {
        return [2, 'no attachmentId'];
    }

    return [0, attachmentId];
}

/**
 * Convert attachment to object in json format
 * @param {attachment} attachment - attachment object need to be converted
 *
 * @return {object} - converted object
 **/
function attachment2Object(attachment) {
    var fieldList = ['len', 'href', 'name', 'type', 'type'];
    var captionList = ['len', 'href', 'name', 'type', 'xmime:contentType'];
    var resourceName = 'attachment';
    var soatypeList = [null, null, null, null, null];
    return lib.RestfulMain.file2Object(attachment, fieldList, captionList, soatypeList, resourceName);
}


function _attachment(attachment) {
    return {
        'len': attachment['len'],
        'href': attachment['href'],
        'name': attachment['name'],
        'type': attachment['type']
    };
}

function _attachmentArray(array) {
    var ret = [];

    var i;
    for (i = 0; i < array.length; i++) {
        ret.push(_attachment(array[i]));
    }
    return ret;
}

/**
 *	Check the privilege to CRUD attachment
 *	@param {string} fileName - table name of the resource
 *	@param {SCFile} file - scfile of a record in table
 *	@param {string} method - get/put/post/delete
 *	@param {SCFile} config - extaccess
 *
 *	@return {object} - no auth, {null} - has auth
 **/
function checkAttachmentPrivilege(fileName, file, method, config, isnew) {
    var objectType = null;
    if (funcs.index(fileName, vars['$G.joinfiles']) > 0 && fileName != null) {
        objectType = "device";
    }

    //get.object
    var tempResults = lib.RestfulQuery.getObject(fileName, objectType);
    var object = tempResults.object;
    var env = tempResults.env;
    var authorized = tempResults.authorized;
    var returnMsg;
    var returnCode;

    if (object != null) {
        //if the user has no privilege to access this table, return no auth code
        if (!funcs.parse_evaluate(object['engine.access'] + "", 4)) {
            returnMsg = funcs.scmsg(177, "object", [config['rest.list.name']]);
            returnCode = restRC['no auth'];
            return {
                'returnCode': returnCode,
                'message': returnMsg
            };
        }
        if (!authorized) {
            //need to change
            returnMsg = funcs.scmsg(185, "object", [config['rest.list.name']]);
            returnCode = restRC['no auth'];
            return {
                'returnCode': returnCode,
                'message': returnMsg
            };
        }

        if (env != null) {
            vars.$L_tableAccess_view = true;
            vars.$L_tableAccess_update = true;
            lib.RestfulQuery.modifyTableAccess(fileName, env);
            setupTableAccess(env, fileName, file, object);

            if (isnew) {
                if (!funcs.parse_evaluate(vars.$L_tableAccess_new + "", 4)) {
                    return {
                        'returnCode': restRC['no auth'],
                        'message': funcs.scmsg(37, "restful", [config['rest.list.name']])
                    };
                }
            } else if (method == "GET") {
                if (!funcs.parse_evaluate(vars.$L_tableAccess_view + "", 4)) {
                    return {
                        'returnCode': restRC['no auth'],
                        'message': funcs.scmsg(17, "restful", [config['rest.list.name']])
                    };
                }
            } else if (!funcs.parse_evaluate(vars.$L_tableAccess_update + "", 4)) {
                return {
                    'returnCode': restRC['no auth'],
                    'message': funcs.scmsg(21, "restful", [config['rest.list.name']])
                };
            }
        }
    }
}


/**
 *	Rewrite the function in RAD se.search.engine Panel setup.tableAccess to js
 *	@param {SCFile} env - profile
 *	@param {string} fileName - table name of the resource
 *	@param {SCFile} file - scfile of a record in table
 *	@param {SCFile} object - Object record of the file
 *
 *	@return - N/A
 **/
function setupTableAccess(env, fileName, file, object) {
    var tableAccess = null;
    var folderExists = funcs.exists("folder", file) ? true : false;
    if (env['tableAccess'] != null && fileName != "rootcause" && fileName != "rootcausetask" && fileName != "knownerror" && fileName != "knownerrortask") {
        tableAccess = funcs.val(env['tableAccess'], 6);
    } else if (env['tableAccessProb'] != null && fileName == "rootcause") {
        tableAccess = funcs.val(env['tableAccessProb'], 6);
    } else if (env['tableAccessTask'] != null && fileName == "rootcausetask") {
        tableAccess = funcs.val(env['tableAccessTask'], 6);
    } else if (env['tableAccessKE'] != null && fileName == "knownerror") {
        tableAccess = funcs.val(env['tableAccessKE'], 6);
    } else if (env['tableAccessKETask'] != null && fileName == "knownerrortask") {
        tableAccess = funcs.val(env['tableAccessKETask'], 6);
    } else if (funcs.filename(env) == "tableAccess") {
        tableAccess = env;
    }
    if (tableAccess != null) {
        lib.tableAccess.setAccessVars(file, tableAccess, object, folderExists);
    }
}


/**
 * whether file is for knowledgebase
 *
 * @param {String} filename
 * @returns {Boolean}
 */
function isKnowledgebaseFile(filename) {
    var base = lib.c.$("!kmknowledgebase").fields("kbname").find("sclibtablename=:name", filename).one();
    return base != null;
}


/**
 * pre process before process attachment
 */
function preProcess(record) {

    // call km trigger only before delete, not before add
    var filename = funcs.filename(record);
    if (isKnowledgebaseFile(filename)) {
        lib.KMCollection_Update_Triggers.kmtriggerBeforeUpdate(filename, record);
    }
}


/**
 * post process after process attachment successfully
 */
function postProcess(record) {
    var filename = funcs.filename(record);
    if (isKnowledgebaseFile(filename)) {
        lib.KMCollection_Update_Triggers.kmtriggerForUpdate(filename, record, record);
    }
}