var Promise = lib.Promise.require();
var ReturnCode = lib.SmartEmailReturnCode.getReturnCode();

var $ = lib.c.$;
var logger = getLog('SmartEmailSMHelper');

/*************************************************************************
Create interaction or incident
**************************************************************************/

// call add action to add sm object
function createRecord(task, operator, useSmartTicket) {
      var promise = new Promise();
      var smObject = task.internalObject;
      
      var defaultValues = {};
      
      try {
            vars['$post.open.fulfillment.record'] = true;

            if (useSmartTicket) {
                  // smart ocr
                  if (vars.$lo_idol_img_enabled || vars.$lo_idol_enabled) {
                        if (task.inRecord["attachmentList"]) {
                              var attachments = rteJSONParse(task.inRecord["attachmentList"]);        
                              if (attachments) {
                                    var ocr_field = lib.SmartEmailUtil.getObjectOCRField(system.functions.filename(smObject));
                                    var language = lib.NotificationRecipientsHelp.getLang(operator);
                                    //QCCR1E150708
                                    var IDOL_Image_Lang_Rule = lib.IDOL_Image_Lang_Rule.require();
                                    var idolLanguage = IDOL_Image_Lang_Rule.mappingIDOLLang(language);
                                    if(idolLanguage == ""){
                                       idolLanguage = language;
                                       logger.info("failed to mapping idolLanguage with sm language.");
                                    }
                                    lib.SmartEmail_IDOL.processOCR(smObject, attachments, ocr_field, idolLanguage);
                              }
                        }
                  }
                  
                  // smart classfication
                  if (vars.$lo_idol_enabled) {
                        defaultValues = lib.SmartEmail_IDOL.fillSuggestionRESTAPI(smObject, operator);
                  }
            }
            
            var ret = smObject.doAction('add');
            if (ret == RC_SUCCESS) {
                  promise.fulfillPromise(ReturnCode.SUCCESS);
            } else if (ret == RC_VALIDATION_FAILED) {
                  promise.rejectPromise(ReturnCode.VALIDATION_ERROR);
                  if (vars.$lo_idol_enabled) {
                        var id = createDefaultRecord(smObject, defaultValues);
                        task.internalId = id;
                  }
            } else if (ret == RC_NOT_AUTHORIZED){
                  promise.rejectPromise(ReturnCode.NOT_AUTHORIZED);
            } else {
                  promise.rejectPromise(ReturnCode.ACTION_ERROR);
            }
      } catch (ex) {
            promise.rejectPromise(ReturnCode.SERVER_ERROR);
      } finally {
            vars['$post.open.fulfillment.record'] = null;
      }
      return promise;
}

// restore default values and create record
function createDefaultRecord(smObj, defaultValues) {
      logger.info("creating record with default values, due to validation error.");
      for (var p in defaultValues) {
            smObj[p] = defaultValues[p];
      }
      var ret = smObj.doAction('add');
      if (ret == RC_SUCCESS) {
            logger.info("success to create record with default values.");
            var filename = system.functions.filename(smObj);
            var id = null;
            if (filename == 'incidents') {
                  id = smObj['incident.id'];
            } else if (filename == 'probsummary') {
                  id = smObj['number'];
            }
            return id;
      } else {
            logger.info("failed to create record with default values.");
      }
      return null;
}

/*************************************************************************
Approve or Deny
**************************************************************************/

// approve or deny interaction, provide operator
function approveInteraction(interactionId, action, comment, operator) {
      var promise = new Promise();
      
      if (comment) {
            vars['$smart.email.commment'] = comment;
      }
      
      var interaction = new SCFile('incidents');
      var ret = interaction.doSelect('incident.id="' + interactionId + '"');
      if (ret != RC_SUCCESS) {
            promise.rejectPromise(ReturnCode.RECORD_NOT_FOUND);
      } else {
            //vars['$smart.email.reason'] = reason;
            try {
                  ret = interaction.doAction(action);
                  if (ret == RC_SUCCESS) {
                        promise.fulfillPromise(ReturnCode.SUCCESS);
                  } else if (ret == RC_VALIDATION_FAILED) {
                        promise.rejectPromise(ReturnCode.VALIDATION_ERROR);
                  } else if (ret == RC_NOT_AUTHORIZED){
                        promise.rejectPromise(ReturnCode.NOT_AUTHORIZED);
                  } else {
                        promise.rejectPromise(ReturnCode.ACTION_ERROR);
                  }
            } catch (ex) {
                  promise.rejectPromise(ReturnCode.SERVER_ERROR);
            } finally {
                  vars['$smart.email.commment'] = null;
            }
      }
      
      
      return promise;
}


function approveApproval(id, fileName, approvalName, action, comment, operator) {
      var promise = new Promise();
      
      vars['$fg.approval'] = false;
      vars['$svcCatalog.can.approve'] = true;
      vars['$denyAllComment'] = comment;
      vars['$denyAllReason'] = null;
      
      var sql = 'unique.key="' + id + '" and file.name="' + fileName + '"';
      if (approvalName) {
          sql += ' and name="' + approvalName + '"';
      }
      var appr = new SCFile("Approval");
      var ret = appr.doSelect(sql);
      if (ret == RC_SUCCESS) {
            if (appr['approval.status'] != 'pending') {
                  promise.rejectPromise(ReturnCode.ACTION_ERROR);
            } else if (!lib.SmartEmailSecurityUtils.checkApprovePermission(operator, appr, vars['$G.myGroups']) 
                        && lib.ApprovalUtil.checkApprovalDelegate(sql, fileName) == '') {
                  promise.rejectPromise(ReturnCode.NOT_AUTHORIZED);
            } else {
                  ret = appr.doAction(action);
                  if (ret == RC_SUCCESS) {
                      promise.fulfillPromise(ReturnCode.SUCCESS);
                  } else if (ret == RC_VALIDATION_FAILED) {
                              promise.rejectPromise(ReturnCode.VALIDATION_ERROR);
                        } else if (ret == RC_NOT_AUTHORIZED){
                              promise.rejectPromise(ReturnCode.NOT_AUTHORIZED);
                        } else {
                              promise.rejectPromise(ReturnCode.ACTION_ERROR);
                        }
            }
      } else {
            promise.rejectPromise(ReturnCode.RECORD_NOT_FOUND);
      }
      return promise;
}


/*************************************************************************
Accept or Reject
**************************************************************************/

function getStatusMap() {
      return STATUS_MAP;
}

/**
* action: accept or reject
*/
function doAcceptOrReject(scfile, actionMap) {
      var promise = new Promise();
	  if (scfile['current.phase'] == 'Closure' || scfile['current.phase'] == 'Abandonment') {
	   promise.rejectPromise(ReturnCode.ACTION_ERROR);
	   return promise;
	  }
      
      try {
            lib.smis_CommonLib.convertToSMObject(actionMap['update'], scfile);
            var ret = scfile.doAction(actionMap['action']);
            if (ret == RC_SUCCESS) {
                  promise.fulfillPromise(ReturnCode.SUCCESS);
            } else if (ret == RC_VALIDATION_FAILED) {
                  promise.rejectPromise(ReturnCode.VALIDATION_ERROR);
            } else if (ret == RC_NOT_AUTHORIZED){
                  promise.rejectPromise(ReturnCode.NOT_AUTHORIZED);
            } else {
                  promise.rejectPromise(ReturnCode.ACTION_ERROR);
            }
      } catch (ex) {
            promise.rejectPromise(ReturnCode.SERVER_ERROR);
      }
      
      return promise;

}


function _getFulfillmentRecord(interaction_id) {
  var sc_query = "source=\"" + interaction_id + "\" and source.filename=\"incidents\" and type isin {\"Escalation\",\"Fulfillment\"} and depend.filename isin {\"problem\",\"rootcause\",\"request\"}";
  var sc_record = $("#screlationService").getRelatedRecord(sc_query);
  if (sc_record) {
    var _filename = (sc_record.depend_filename === "problem") ? "probsummary" : sc_record.depend_filename;
    var _idfield = (_filename === "rootcause") ? "id" : "number";
    
    return $(_filename, SCFILE_READONLY).select(_idfield + "=\"" + sc_record.depend + "\"").uniqueResult();
  }
  
  return null;
}

function canCloseFulfillmentRecord(interaction_id) {
  var fulfillment_record = _getFulfillmentRecord(interaction_id);
  if (fulfillment_record) {
    return lib.StatusSyncServiceConfig.canClose(fulfillment_record);
  }
  
  return true;
}

function canReopenFulfillmentRecord(interaction_id) {
  var fulfillment_record = _getFulfillmentRecord(interaction_id);
  if (fulfillment_record) {
      var _fieldmap = {
        probsummary: {status: "problem.status"},
        rootcause: {status: "rcStatus"},
        request: {status: "status"}
      }
  
    var _status = fulfillment_record[_fieldmap[system.functions.filename(fulfillment_record)]["status"]];
    return _status !== "Closed";
  }
  
  return true;
}


/*************************************************************************
activity log
**************************************************************************/


function addSmartEmailActivities(file, action, emailSubject, visibleToCustomer) {
    vars.$email_action = action;
    vars.$email_subject = emailSubject;
    createActivityLog(file, file, "update", visibleToCustomer);
    vars.$email_action = null;
    vars.$email_subject = null;
}

function createActivityLog(file, oldfile, actType, visibleToCustomer) {
    var rteNames = new SCDatum();
    rteNames.push("file");
    rteNames.push("second.file");
    rteNames.push("text");
    rteNames.push("boolean1");

    var rteValues = new SCDatum();
    rteValues.push(file);
    rteValues.push(oldfile);
    rteValues.push(actType);
    rteValues.push(visibleToCustomer);

    // call rad "sc.activity" to create an activity log
    system.functions.rtecall("callrad", new SCDatum(), "sc.activity", rteNames, rteValues, false);
}


/*************************************************************************
escalation related
**************************************************************************/

function isInteractionEscalated(interactionId) {
      var escalated = false;
      var screlations = $('screlation').select('source.filename="incidents" and source="%S"', [interactionId]);
      screlations.iterate(function(screlationFile) {
            if ('Escalation' == screlationFile['type'] || 'Fulfillment' == screlationFile['type']) {
                  escalated = true;
                  return true;
            }
      });
      return escalated;
}


/*************************************************************************
lock & unlock
**************************************************************************/

function lock(lockName) {
    var rteNames = new SCDatum();
    rteNames.push("name");
    rteNames.push("cond.input");
    rteNames.push("boolean1");

    var rteValues = new SCDatum();
    rteValues.push(lockName);
    rteValues.push(true);
    rteValues.push(false);

    return system.functions.callrad("lock", rteNames, rteValues, false);
}

function unlock(lockName) {
    var rteNames = new SCDatum();
    rteNames.push("name");

    var rteValues = new SCDatum();
    rteValues.push(lockName);

    return system.functions.callrad("unlock", rteNames, rteValues, false);
}

