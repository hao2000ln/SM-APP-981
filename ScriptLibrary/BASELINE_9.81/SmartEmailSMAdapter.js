/******************************************************
 * Module Name: SmartEmail SM adapter
 * Function: provide adapter to process in SM
 * Author: Tian, ShaoQin
 * Version: 2.00
 * Creation Date: Mar, 2016
 *******************************************************/
var _ = lib.Underscore.require();
var $ = lib.c.$;

var ReturnCode = lib.SmartEmailReturnCode.getReturnCode();

var Class = lib.smis_Prototype.getClass();


var SmartEmailSMAdapterClass = Class.create({

    initialize: function(configItem) {
        this.configItem = configItem;
        this.logger = configItem.getLogger();
        this.instanceName = configItem.name;
    },

    getRecords: function() {
        var records = [];
        return records;
    },

    // return action code
    sendRecord: function(task, action) {
        var code = ReturnCode.SUCCESS;

        // do action: approve/deny, accept/reject, comment, resolve
        var operator = task['operator'];

        try {
            this.logger.info("SmartEmailSMAdapter", "set user to " + operator);
            var oriOperator = funcs.operator();
            lib.SmartEmailUtil.setOperator(operator);

            if (action == "add") {
                code = this.handleAdd(task, operator);
            } else if (action == "update") {
                // set Global my groups
                vars['$G.myGroups'] = $('myGroups').select('name="%S"', [operator]).scfile;

                // get action from token
                // *****Token:incident.id=SD10193&amp;_file=incidents&amp;_recipient=shaoqin.tian@hpe.com&amp;_action=comment&amp;_time=1460707153807*****
                var tokenAction = task.inRecord['token'].action;
                switch (tokenAction) {
                    case "approve":
                    case "deny":
                        code = this.handleApprove(task, tokenAction, operator);
                        break;
                    case "accept":
                    case "reject":
                    case "comment":
                        var comment = task.inRecord.body;
                        if (!comment || comment.length == 0) {
                            task.responseMsg = 'Ignored due to empty comment.';
                            code = ReturnCode.EMPTY_COMMENT;
                            break;
                        }
                    case "close":
                    case "resolve":
                    case "update":
                        code = this.handleUpdate(task, tokenAction, operator);
                        break;
                }

                // clean global groups
                vars['$G.myGroups'] = $('myGroups').select('name="%S"', [oriOperator]).scfile;
            }
        } catch (ex) {
            this.logger.error("SmartEmailSMAdapter", "Error when handling action: " + ex.toString());
            code = ReturnCode.SERVER_ERROR;
        } finally {
            this.logger.info("SmartEmailSMAdapter", "set user back to " + oriOperator);
            lib.SmartEmailUtil.setOperator(oriOperator);
        }

        return code;
    },

    handleAdd: function(task, operator) {
        var resultCode = ReturnCode.SUCCESS;
        var filename = funcs.filename(task.internalObject);
        var keyfield = lib.SmartEmailUtil.getUniqueKeyField(filename);
        var useSmartTicket = this.configItem.getConfigParameterValue('SMAAutoClassification');

        if (!lib.SmartEmailSecurityUtils.hasNewRight(operator, task.internalObject, task.object)) {
            this.logger.error("SmartEmailSMAdapter", "have no permission to add this " + funcs.scmsg(task.object, "tablename") + " ticket.");
            return ReturnCode.NOT_AUTHORIZED;
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailSMAdapter", "adding " + funcs.scmsg(task.object, "tablename"));
        }
        
        if (!this.fieldNameTypeList) {
            this.fieldNameTypeList = this.configItem.getSMFieldNameTypeList();
        }
    
        // project the field values in task to scfile
        updateFieldValueList = lib.SmartEmailUtil.projectMailBodyToFile(task.internalObject, task.inRecord.body, this.fieldNameTypeList[0], this.fieldNameTypeList[1], operator);
        // Store the field value list in task JSON
        task["updateFieldValueList"] = updateFieldValueList;

        // set $fromEmail to enable 'Open from Email' activityaction
        vars.$fromEmail = true;
        var that = this;
        lib.SmartEmailSMHelper.createRecord(task, operator, useSmartTicket).then(
            function(newId) {
                if (that.logger.isDebugEnabled()) {
                    that.logger.debug("SmartEmailSMAdapter", "success to add " + funcs.scmsg(task.object, "tablename") + " " + newId);
                }
                task.internalId = task.internalObject[keyfield];
            },
            function(code) {
                that.logger.error("SmartEmailSMAdapter", "failed to add " + funcs.scmsg(task.object, "tablename") + ".");
                resultCode = code;
            }
        );

        vars.$fromEmail = false;
        return resultCode;
    },

    handleApprove: function(task, action, operator) {
        var resultCode = ReturnCode.SUCCESS;

        // set approve status to "approved", copy email content to the comments of approval log. 
        // add activity log, activity description shall be email subject, activity type is "Approval from Email"
        // find the approval record and call doAction approve
        var tokenData = task.inRecord['token'];
        var id = tokenData['id'];
        var fileName = tokenData['file'];
        var approvalName = tokenData['name'];
        var that = this;
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailSMAdapter", action + "ing approval");
        }

        // set default comment:
        var comment = task.inRecord.body;
        if (!comment || comment.length == 0) {
            var prefix = '';
            if (action == 'approve') {
                prefix = 'Approved by email';
            } else if (action == 'deny') {
                prefix = 'Denied by email';
            }
            comment = [prefix + ' - [' + task.inRecord.subject + ']'];
        }

        lib.SmartEmailSMHelper.approveApproval(id, fileName, approvalName, action, comment, operator).then(
            function(code) {
                that.logger.info("SmartEmailSMAdapter", "success to " + action + " approval");
                //return ReturnCode.SUCCESS;
            },
            function(code) {
                that.logger.error("SmartEmailSMAdapter", "failed to " + action + " approval, error code is: " + code);
                resultCode = code;
            }
        );

        // When there is no approval record of change/request, check if the change/request exists. 
        // If exist, set the return code to ACTION_ERROR
        if (resultCode == ReturnCode.RECORD_NOT_FOUND && (fileName == "cm3r" || fileName == "request")) {
            var keyFields = lib.tableFunctions.getUniqueKey(fileName);
            if (keyFields != null && keyFields.length > 0) {
                var query = keyFields[0] + "=\"" + id + "\"";
                var file = $(fileName, SCFILE_READONLY).setFields([keyFields[0]]).select(query).uniqueResult();
                if (file != null) {
                    resultCode = ReturnCode.ACTION_ERROR;
                }
            }
        }

        // add approval activity
        if (resultCode == ReturnCode.SUCCESS && (fileName == "incidents" || fileName == "cm3r" || fileName == "request")) {
            var keyfield = lib.SmartEmailUtil.getUniqueKeyField(fileName);
            if (keyfield != null) {
                var scfile = $(fileName).select(keyfield + '="%S"', [id]).scfile;
                lib.SmartEmailSMHelper.addSmartEmailActivities(scfile, action, task.inRecord.subject, false);
            }
        }

        return resultCode;
    },

    handleUpdate: function(task, action, operator) {
        // set status to "Closed", and add activity log to interaction and related records. Related records can be found in screlate table
        // set status to "In Progress" (interaction/request) or "Work In Progress" (incident), and add activity log to interaction and related records. Related records can be found in screlate table
        var resultCode = ReturnCode.SUCCESS;

        var tokenData = task.inRecord['token'];
        var id = tokenData['id'];
        var fileName = tokenData['file'];

        var keyField = task.inRecord['keyField'];
        var scfile = $(fileName).select(keyField + '="%S"', [id]).scfile;

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailSMAdapter", "updating " + funcs.scmsg(task.object, "tablename") + " action " + action);
        }

        // statusMap is configured in instance's post script
        var actionMap = task.smisContext.actionMap;
        if (actionMap == null) {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("SmartEmailSMAdapter", "set default action map. ");
            }
            actionMap = { action: "save", update: {} };
        }

        if ((action == 'accept' || action == 'reject') && !lib.SmartEmailConstants.isResolved(scfile)) {
            this.logger.warn("SmartEmailSMAdapter", "status is not resolved. ");
            return ReturnCode.ACTION_ERROR;
        }

        if (action == 'resolve' && lib.SmartEmailConstants.isResolved(scfile)) {
            this.logger.warn("SmartEmailSMAdapter", "status is already resolved. ");
            return ReturnCode.ACTION_ERROR;
        }

        var i;
        if (action == 'close') {
            if (lib.SmartEmailConstants.isClosed(scfile)) {
                this.logger.warn("SmartEmailSMAdapter", "status is already closed. ");
                return ReturnCode.ACTION_ERROR;
            }

            var comment = task.inRecord.body;
            if (comment != null && comment.length > 0) {
                if (scfile["closing.comments"] == null) {
                    scfile["closing.comments"] = [];
                }
                for (i = 0; i < comment.length; i++) {
                    scfile["closing.comments"].push(comment[i]);
                }
            }
        }

        if (!this.fieldNameTypeList) {
            this.fieldNameTypeList = this.configItem.getSMFieldNameTypeList();
        }

        var updateFieldValueList = [];
        if (action == "update") {
            if (lib.SmartEmailConstants.isClosed(scfile)) {
                this.logger.warn("SmartEmailSMAdapter", "cannot update a closed ticket. ");
                return ReturnCode.ACTION_ERROR;
            }

            if (!lib.SmartEmailSecurityUtils.hasUpdateRight(operator, scfile, task.object)) {
                this.logger.error("SmartEmailSMAdapter", "have no permission to update this " + funcs.scmsg(task.object, "tablename") + " ticket " + id);
                return ReturnCode.NOT_AUTHORIZED;
            }

            // project the field values in task to scfile
            updateFieldValueList = lib.SmartEmailUtil.projectMailBodyToFile(scfile, task.inRecord.body, this.fieldNameTypeList[0], this.fieldNameTypeList[1], operator);

            // Store the field value list in task JSON
            task["updateFieldValueList"] = updateFieldValueList;

            // If no field to update, do NOT execute update
            if (updateFieldValueList == null || updateFieldValueList.length == 0) {
                return ReturnCode.SUCCESS;
            }
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailSMAdapter", "executing " + action + " ticket");
        }
        var that = this;
        lib.SmartEmailSMHelper.doAcceptOrReject(scfile, actionMap).then(
            function(code) {
                if (that.logger.isDebugEnabled()) {
                    that.logger.debug("SmartEmailSMAdapter", "success to " + action + " ticket");
                }
                //return ReturnCode.SUCCESS;
            },
            function(code) {
                that.logger.error("SmartEmailSMAdapter", "failed to " + action + " ticket, error code is: " + code);
                resultCode = code;
            }
        );

        // activity log is visible to customer if not interaction
        if (resultCode == ReturnCode.SUCCESS) {
            var customerVisible = true;
            if (fileName == 'incidents') {
                customerVisible = false;
            }
            var activityDescription = [task.inRecord.subject];
            if (action == 'comment') {
                var actDesc = task.inRecord.body;
                if (actDesc) {
                    activityDescription = actDesc;
                    if (actDesc.length > 0) {
                        // escape html tag of comments and simulate html editor behavior
                        for (i = 0; i < actDesc.length; i++) {
                            activityDescription[i] = "<p>" + _.escape(actDesc[i]) + "</p>";
                        }
                    }
                }
            }

            // add the update field and value into activity
            for (i = 0; i < updateFieldValueList.length; i++) {
                activityDescription.push(updateFieldValueList[i][0] + " : " + funcs.str(updateFieldValueList[i][1]));
            }

            lib.SmartEmailSMHelper.addSmartEmailActivities(scfile, action, activityDescription, customerVisible);
        }

        if (resultCode == ReturnCode.SUCCESS && fileName == 'incidents') {
            var checkFulfill = true;
            switch (action) {
                case 'accept':
                    //checkFulfill = lib.SmartEmailSMHelper.canCloseFulfillmentRecord(id);
                    break;
                case 'reject':
                    checkFulfill = lib.SmartEmailSMHelper.canReopenFulfillmentRecord(id);
                    break;
            }
            if (!checkFulfill) {
                that.logger.warn("SmartEmailSMAdapter", "failed to check fulfill record.");
                resultCode = ReturnCode.ACTION_ERROR;
            }
        }

        return resultCode;
    },

    getFields: function() {}
});


function getClass() {
    return SmartEmailSMAdapterClass;
}

/**
 *  Return module list
 *  Only when this function exists and its returned value is not null
 *  SMISRegistry enables module
 */
function getModuleList() {
    return lib.SmartEmailUtil.getModuleList();
}

/**
 *  Return the selected module in SMIS instance
 *  Only when the module is available in the module list
 *  SMISConfiguration enables module
 */
function getSelectedModule() {
    return lib.SmartEmailUtil.getSelectedModule();
}