/******************************************************
 * Module Name: SMIS Microsoft Teams Manager
 * Function: Manager Interface
 * Author: Zhang, Qi
 * Version: 1.11
 * Creation Date: Jan, 2021
 *******************************************************/
var $ = lib.c.$;

var Class = lib.smis_Prototype.getClass();

var MicrosoftTeamsManagerClass = Class.create(lib.smis_Manager.getClass(), {

    validateParams: function() {
        // check mandatory
        var mandatoryList;

        var grantType = this.configItem.getConfigParameterValue("grantType");
        if (!grantType || grantType == lib.OAuthAuthentication.grantTypeROPC()) {
            mandatoryList = ["username", "password", "clientID", "tenantID", "clientSecret"];
        } else if (grantType == lib.OAuthAuthentication.grantTypeAuthCode()) {
            mandatoryList = ["clientID", "tenantID", "clientSecret"];
        }

        var result = lib.MicrosoftTeamsUtil.validateSMISParams(this.configItem, mandatoryList);
        if (result) {
            return result;
        }

        // check value type
        var field = "synchronizeInterval";
        result = lib.smis_CommonLib.validatePositiveNumberSMISParams(this.configItem, field, "msteams");
        if (result) {
            return result;
        }

        return null;
    },

    beforeEnableInstance: function() {
        var grantType = this.getGrantType();

        // check access token first in auth code grant type
        if (grantType == lib.OAuthAuthentication.grantTypeAuthCode()) {
            var intId = this.configItem.intId;
            var module = lib.MicrosoftTeamsUtil.getTeamsTokenModule(intId);

            var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(module);
            if (!lib.OAuthAuthentication.isTokenAvailable(ftoken)) {
                funcs.rtecall("msg", new SCDatum(), funcs.scmsg("73", "smis"), 2);
                return false;
            }
        }

        return true;
    },

    enableInstance: function() {
        // set logger level
        if (!lib.MicrosoftTeamsConfiguration.isMultiInstanceMode()) {
            lib.MicrosoftTeamsUtil.setLoggerLevel(this.configItem.loggerLevel);
        }
    },

    /**
     * append records to tasklist
     */
    appendTasks: function() {
        this.info("start appending tasks.");

        var configItem = this.configItem;
        var count = 0;
        var result;

        var isSyncMessage = this.isSynchronizeMessage();
        this.info("message synchronization is " + (isSyncMessage ? "enabled" : "disabled") + ".");

        if (isSyncMessage) {
            // synchronize reply task
            var modules = lib.MicrosoftTeamsChannel.getAllModules();
            modules.forEach(function(module) {
                result = lib.MicrosoftTeamsTaskManager.newTaskForSyncReplyAllActive(configItem, module);
                if (result) {
                    count++;
                }
            });
        }

        // refresh refreshToken task
        var grantType = this.getGrantType();
        if (grantType == lib.OAuthAuthentication.grantTypeAuthCode()) {
            result = lib.MicrosoftTeamsTaskManager.newTaskForRefreshRefreshToken(configItem);
            if (result) {
                count++;
            }
        }

        var msg = count + (count > 1 ? " tasks" : " task") + " appended.";
        this.info(msg);
    },

    process: function(task) {
        this.info("process task.");

        var isSyncAttach = this.isSynchronizeAttachment();
        this.info("attachment synchronization is " + (isSyncAttach ? "enabled" : "disabled") + ".");

        var action = task.action;
        var result;

        // synchronize attachment metadata
        if (action == lib.MicrosoftTeamsConstants.ACTION_SYNC_CHANNEL_ATTACHMENTS_METADATA()) {

            if (!isSyncAttach) {
                return false;
            }

            var channelId = task.externalId;

            if (!channelId) {
                this.updateTaskWithError(task, "teams channel id not found.");
                return false;
            }

            result = lib.MicrosoftTeamsAttachment.synchronizeAttachmentsMetadata(channelId);
            if (result.error) {
                this.updateTaskWithError(task, result.error);
                return false;
            }

            this.info(result.count + " attachments metadata synchronized of channel " + task.internalId + ".");
            return true;
        }
        // synchronize reply
        else if (action == lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_REPLIES()) {

            // get PII user display name
            var piiUserName = "";
            if (this.isPIIHide()) {
                piiUserName = this.getPIIUsername();
                if (!piiUserName) {
                    piiUserName = "Microsoft Teams";
                }
                this.info("PII support is enabled, set all users' display name to \"" + piiUserName + '".');
            }

            var configItem = this.configItem;
            var message;

            // 2 modes, synchronize all active message replies or synchronize one message reply
            var internalId = task.internalId;

            // replies of all active messages
            if (!internalId) {
                result = lib.MicrosoftTeamsMessage.synchronizeAllActiveMessages(configItem.intId, task.object, piiUserName);
                if (result.error) {
                    this.updateTaskWithError(task, result.error);
                    if (!result.count || result.count == 0) {
                        return false;
                    }
                }
                this.info(result.count + " " + (result.count > 1 ? "replies" : "reply") + " synchronized of record " + task.object + ".");

                // append synchronize hosted content task
                var hostedContents = result.hostedContents;
                if (hostedContents && hostedContents.length > 0) {

                    hostedContents.forEach(function(content) {
                        var values = content.values;
                        if (values && values.length > 0) {
                            message = $("msTeamsMessageInfo").find("messageId=:id", content.messageId).one();

                            // new hosted content task                     
                            lib.MicrosoftTeamsTaskManager.newTaskForSyncHostedContents(configItem, message, values);
                        }
                    });
                }

                // append synchronize attachment task
                if (isSyncAttach) {
                    var attachments = result.attachments;
                    if (attachments && attachments.length > 0) {

                        attachments.forEach(function(attachment) {
                            var values = attachment.values;
                            if (values && values.length > 0) {
                                message = $("msTeamsMessageInfo").find("messageId=:id", attachment.messageId).one();

                                // new attachment metadata task
                                lib.MicrosoftTeamsTaskManager.newTaskForSyncAttachmentMeta(configItem, message.channelId);

                                // new attachment task                     
                                lib.MicrosoftTeamsTaskManager.newTaskForSyncAttachments(configItem, message, values);
                            }
                        });
                    }
                }
            }
            // replies of one message 
            else {
                var messageId = task.externalId;
                if (!messageId) {
                    this.updateTaskWithError(task, "teams message id not found.");
                    return false;
                }
                message = $("msTeamsMessageInfo").find("messageId=:id", messageId).one();
                if (!message) {
                    this.updateTaskWithError(task, 'teams message id "' + messageId + '" not found.');
                    return false;
                }

                result = lib.MicrosoftTeamsMessage.synchronizeMessage(message, piiUserName);
                if (result.error) {
                    this.updateTaskWithError(task, result.error);
                    return false;
                }

                this.info(result.count + " " + (result.count > 1 ? "replies" : "reply") + " synchronized of record " + task.object + ":" + task.internalId + ".");

                // append synchronize hosted content task
                if (result.hostedContents && result.hostedContents.length > 0) {
                    lib.MicrosoftTeamsTaskManager.newTaskForSyncHostedContents(configItem, message, result.hostedContents);
                }

                // append synchronize attachment task
                if (isSyncAttach && result.attachments && result.attachments.length > 0) {
                    lib.MicrosoftTeamsTaskManager.newTaskForSyncAttachmentMeta(configItem, message.channelId);
                    lib.MicrosoftTeamsTaskManager.newTaskForSyncAttachments(configItem, message, result.attachments);
                }
            }

            return true;
        }
        // synchronize attachment
        else if (action == lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_ATTACHMENT()) {

            if (!isSyncAttach) {
                return false;
            }

            var requestData;
            try {
                requestData = JSON.parse(task.requestData);
            } catch (e) {
                this.error(e.message);
                return false;
            }

            var attachment = requestData.attachment;

            result = lib.MicrosoftTeamsAttachment.synchronizeAttachment(requestData.messageId, attachment);
            if (result.error) {
                this.updateTaskWithError(task, result.error);
                return false;
            }

            this.info('attachment "' + attachment + '" synchronized of record "' + task.object + ":" + task.internalId + '".');

            return true;
        }
        // synchronize hosted content
        else if (action == lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_HOSTEDCONTENT()) {

            var hcRequestData;
            try {
                hcRequestData = JSON.parse(task.requestData);
            } catch (e) {
                this.error(e.message);
                return false;
            }

            result = lib.MicrosoftTeamsHostedContent.synchronizeHostedContent(hcRequestData.messageId, hcRequestData.url);
            if (result.error) {
                this.updateTaskWithError(task, result.error);
                return false;
            }

            this.info('hosted content synchronized of record "' + task.object + ":" + task.internalId + '".');

            return true;
        }
        // send conversation message
        else if (action == lib.MicrosoftTeamsConstants.ACTION_SEND_MESSAGE()) {

            var conversationData;
            try {
                conversationData = JSON.parse(task.requestData);
            } catch (e) {
                this.error(e.message);
                return false;
            }

            result = lib.MicrosoftTeamsNotification.sendNotification(this.configItem.intId,
                task.externalId, conversationData.serviceUrl,
                conversationData.conversationId, conversationData.message);

            if (result.error) {
                this.updateTaskWithError(task, result.error);
                return false;
            }

            this.info(`send notification "${task.internalId}".`);

            return true;
        }
        // refresh refreshToken
        else if (action == lib.MicrosoftTeamsConstants.ACTION_REFRESH_REFRESHTOKEN()) {
            var module = task.internalId;
            result = lib.AzureAuthentication.refreshRefreshToken(this.configItem, module);

            if (result.error) {
                this.updateTaskWithError(task, result.error);
                return false;
            }

            this.info(`refresh refresh token for "${module}".`);

            return true;
        }

        return false;
    },

    isSynchronizeMessage: function() {
        var isSyncMessage = this.configItem.getConfigParameterValue("synchronizeMessage");
        return !!isSyncMessage;
    },

    isSynchronizeAttachment: function() {
        var isSyncAttach = this.configItem.getConfigParameterValue("synchronizeAttachment");
        return !!isSyncAttach;
    },

    isPIIHide: function() {
        var piiHide = this.configItem.getConfigParameterValue("piiHide");
        return !!piiHide;
    },

    getPIIUsername: function() {
        return this.configItem.getConfigParameterValue("piiUsername");
    },

    getGrantType: function() {
        return this.configItem.getConfigParameterValue("grantType");
    },

    updateTaskWithError: function(task, error) {
        if (typeof error == "string") {
            this.error(error);
            task.responseMsg = error;
        } else {
            this.error(JSON.stringify(error));
            task.responseCode = error.code;
            task.responseMsg = error.message;
            // task.data = JSON.stringify(error, null, "   ").split('\n');
        }

        lib.smis_TaskManager.updateTask(task);
    },

    postProcess: function(task) {
        this.info("post process");

        if (task.expired) {
            // send error reply if attachment synchronize failed
            if (task.action == lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_ATTACHMENT()) {
                lib.MicrosoftTeamsTaskManager.postFailedAttachmentReply(task);
            }
            // send error reply if image hosted content synchronize failed
            else if (task.action == lib.MicrosoftTeamsConstants.ACTION_SYNC_MESSAGE_HOSTEDCONTENT()) {
                lib.MicrosoftTeamsTaskManager.postFailedImageReply(task);
            }
        }

        // sleep between sending message to avoid throttling limits
        if (task.action == lib.MicrosoftTeamsConstants.ACTION_SEND_MESSAGE()) {
            funcs.sleep(1);
        }
    },

    info: function(msg) {
        this.logger.info("MicrosoftTeamsManager", "[" + this.configItem.intId + "] " + msg);
    },

    error: function(msg) {
        this.logger.error("MicrosoftTeamsManager", "[" + this.configItem.intId + "] " + msg);
    },

    afterDelInstance: function() {
        // clear oauth data
        const module = lib.MicrosoftTeamsUtil.getTeamsTokenModule(this.intId);
        lib.OAuthAuthentication.clearOAuthData(module);
    }
});

function getClass() {
    return MicrosoftTeamsManagerClass;
}

function hideFields() {
    return true;
}