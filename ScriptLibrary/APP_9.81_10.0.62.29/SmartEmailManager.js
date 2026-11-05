/******************************************************
 * Module Name: SmartEmail Manager
 * Function: provide manager to process smart email task
 * Author: Tian, ShaoQin
 * Version: 3.00
 * Creation Date: Mar, 2016
 *******************************************************/

var DEFAULT_INBOX = "INBOX";

var Class = lib.smis_Prototype.getClass();

var convertString2Time = lib.SmartEmailUtil.convertString2Time;
var convertTime2String = lib.SmartEmailUtil.convertTime2String;
var isPOP3orPOP3s = lib.SmartEmailUtil.isPOP3orPOP3s;
var isEWS = lib.SmartEmailUtil.isEWS;
var isIMAPs = lib.SmartEmailUtil.isIMAPs;
var isEWSGraph = lib.SmartEmailUtil.isEWSGraph;
var trim = lib.SmartEmailUtil.trim;
var sendEmail = lib.SmartEmailUtil.sendEmail;

var ReturnCode = lib.SmartEmailReturnCode.getReturnCode();

var getEmailSubject = lib.MailUtil.getEmailSubject;
var getEmailBody = lib.MailUtil.getEmailBody;

// store connection status
var errorStatus = {};


var SmartEmailManagerClass = Class.create(lib.smis_Manager.getClass(), {

    initialize: function(configItem) {
        this.configItem = configItem;
        this.logger = this.configItem.getLogger();

        this.intId = this.configItem.intId;

        var adapter1Name = this.configItem.SMAdapter;
        this.SMAdapter = new(lib[adapter1Name].getClass())(this.configItem);
        var adapter2Name = this.configItem.EPAdapter;
        this.EPAdapter = new(lib[adapter2Name].getClass())(this.configItem);
        this.validDomains = this.configItem.getConfigParameterValue("validDomains");
        if (null == this.validDomains) {
            this.validDomains = [];
        } else {
            this.validDomains = this.validDomains.split(/[,;]/);
        }
        this.processedFolder = this.configItem.getConfigParameterValue("processedFolder");
        this.errorFolder = this.configItem.getConfigParameterValue("errorFolder");
        this.removeEmail = this.configItem.getConfigParameterValue("deleteEmail");
        this.protocol = this.configItem.getConfigParameterValue("protocol");
        this.host = this.configItem.getConfigParameterValue("server");
        this.port = this.configItem.getConfigParameterValue("port", true);
        this.ewsUrl = this.configItem.getConfigParameterValue("EWSUrl");
        this.sharedInbox = this.configItem.getConfigParameterValue("sharedInbox");
        this.mailboxName = this.configItem.getConfigParameterValue("mailboxName");
        this.useImpersonate = this.configItem.getConfigParameterValue("useImpersonate");
        this.username = this.configItem.getConfigParameterValue("username");
        this.password = this.configItem.getConfigParameterValue("password");
        this.proxyHost = this.configItem.getConfigParameterValue("proxyHost");
        this.proxyPort = this.configItem.getConfigParameterValue("proxyPort", true);
        this.proxyUsername = this.configItem.getConfigParameterValue("proxyUsername");
        this.proxyPassword = this.configItem.getConfigParameterValue("proxyPassword");
        this.proxyType = this.configItem.getConfigParameterValue("proxyType");
        this.proxyUse = this.configItem.getConfigParameterValue("proxyUse");
        this.newEmailUpdate = this.configItem.getConfigParameterValue("newEmailUpdate");
        this.emailArchive = this.configItem.getConfigParameterValue("emailArchive");
        this.mailSizeCheck = this.configItem.getConfigParameterValue("attachProcessing");
        // the value of 'attachSize' from smis is 'kb', times 1024 as 'b'
        var att_size = this.configItem.getConfigParameterValue("attachSize");
        this.maxMailSize = null;
        if (null != att_size) {
            this.maxMailSize = att_size * 1024;
        }
        this.sourceFolderName = trim(this.configItem.getConfigParameterValue("inboxFolder"));
        if (this.sourceFolderName == null || this.sourceFolderName.length == 0) {
            this.sourceFolderName = DEFAULT_INBOX;
        }
        this.serverType = "";

        this.errorCodes = this.configItem.getConfigParameterValue("errorCode").split("~");
        this.errorCases = this.configItem.getConfigParameterValue("errorCases").split("~");
        this.createIncidents = this.configItem.getConfigParameterValue("createIncidents").split("~");
        this.emailAdmins = this.configItem.getConfigParameterValue("emailAdmins").split("~");
        this.emailSenders = this.configItem.getConfigParameterValue("emailSenders").split("~");
        this.emailOthers = this.configItem.getConfigParameterValue("emailOthers").split("~");
        this.errorMessages = this.configItem.getConfigParameterValue("messages").split("~");
        this.adminEmail = this.configItem.getConfigParameterValue("adminEmail");
        this.othersEmail = this.configItem.getConfigParameterValue("othersEmail");

        this.incidentTitle = this.configItem.getConfigParameterValue("title");
        this.incidentAssignmentGroup = this.configItem.getConfigParameterValue("assignmentGroup");
        this.incidentImpact = this.configItem.getConfigParameterValue("impact");
        this.incidentUrgency = this.configItem.getConfigParameterValue("urgency");
        this.incidentCategory = this.configItem.getConfigParameterValue("category");
        this.incidentSubcategory = this.configItem.getConfigParameterValue("subcategory");
        this.incidentArea = this.configItem.getConfigParameterValue("subarea");
        this.incidentAffectedService = this.configItem.getConfigParameterValue("affected.service");

        this.useDefaultOperator = this.configItem.getConfigParameterValue("useDefaultOperator");
        this.defaultOperator = this.configItem.getConfigParameterValue("defaultOperator");

        // Fetch the parameter for OAuth
        this.enableOAuth = this.configItem.getConfigParameterValue("enableOAuth");
        this.grantType = this.configItem.getConfigParameterValue("grantType");
        this.clientID = this.configItem.getConfigParameterValue("clientID");
        this.tenantID = this.configItem.getConfigParameterValue("tenantID");
        this.clientSecret = this.configItem.getConfigParameterValue("clientSecret");
        this.permissionType = this.configItem.getConfigParameterValue("permissionType");

        lib.SmartEmailUtil.initObjectNumberPrefix();
        lib.SmartEmailUtil.setLogger(this.logger);
    },

    initMailReceiver: function(isMailServer) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailManagerClass", "initMailReceiver");
            this.logger.debug("SmartEmailManagerClass", "Protocol: " + this.protocol);
        }

        if (!errorStatus[this.configItem.name]) {
            errorStatus[this.configItem.name] = {};
        }

        if (isEWSGraph(this.protocol)) {
            this.protocol = "EWS";
            this.enableOAuth = true;
            this.permissionType = "Delegated";
        }

        if (isEWS(this.protocol)) {
            this.serverType = "EWS";
        } else {
            this.serverType = "Exchange Server";
        }

        var tokenObj = {};
        var module = lib.SmartEmailUtil.getSmartEmailTokenModule(this.intId);

        if (this.enableOAuth) {
            var config = {
                grantType: this.grantType,
                username: this.username,
                password: this.password,
                clientID: this.clientID,
                tenantID: this.tenantID,
                clientSecret: this.clientSecret,
                proxyHost: this.proxyHost,
                proxyPort: this.proxyPort,
                proxyUsername: this.proxyUsername,
                proxyPassword: this.proxyPassword
            };

            // EWS / Graph API
            if (isEWS(this.protocol)) {
                this.serverType += " OAuth";
                this.permissionType = (this.permissionType == null) ? "Application" : this.permissionType;

                // ROPC / Auth Code
                if (this.permissionType == "Delegated") {
                    this.serverType += " Delegated";
                    var grantType = this.grantType || lib.OAuthAuthentication.grantTypeROPC();
                    tokenObj = lib.AzureAuthentication.getAccessToken(module, grantType, config);
                }
                // Client Credentials
                else {
                    tokenObj = lib.AzureAuthentication.getAccessToken(module, lib.OAuthAuthentication.grantTypeClientCredentials(), config, "https://outlook.office.com/.default");
                }
            }
            // Google IMAPs
            else if (isIMAPs(this.protocol)) {
                this.serverType += " OAuth";

                // token url
                config.authTokenUrl = lib.GoogleAuthentication.TOKEN_URL();

                // Auth Code
                tokenObj = lib.GoogleAuthentication.getAccessToken(module, config);
            }

            if (tokenObj.error) {
                this.logger.error("SmartEmailManagerClass", "Failed to get access token for " + this.serverType);
                this.logger.error("SmartEmailManagerClass", "" + tokenObj.error.code + ": " + tokenObj.error.message);
                return ReturnCode.CONNECTION_FAILURE;
            }
        }

        if (this.sharedInbox) {
            if (isEWS(this.protocol) || isIMAPs(this.protocol)) {
                this.serverType += " SharedInbox";
            }
        }

        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailManagerClass", "ClassType: " + this.serverType);
        }

        var mailOptions = {};
        var optionsJson = "";
        var error;
        if (this.serverType == "Exchange Server") {
            // check if null, undefined, empty.
            if (trim(this.protocol) && trim(this.host) && trim(this.port) && trim(this.username) && trim(this.password)) {
                mailOptions = {
                    "protocol": this.protocol.toLowerCase(),
                    "host": this.host,
                    "port": this.port,
                    "username": this.username,
                    "password": this.password,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "sourceFolderName": this.sourceFolderName
                };
            } else {
                error = "Please input the mandatory values, such as protocol, host, port, username, password!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "Exchange Server SharedInbox") {
            // check if null, undefined, empty.
            if (trim(this.protocol) && trim(this.host) && trim(this.port) && trim(this.username) && trim(this.password) && trim(this.mailboxName)) {
                mailOptions = {
                    "protocol": this.protocol.toLowerCase(),
                    "host": this.host,
                    "port": this.port,
                    "username": this.username,
                    "password": this.password,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "sourceFolderName": this.sourceFolderName,
                    "mailboxName": this.mailboxName
                };
            } else {
                error = "Please input the mandatory values, such as protocol, host, port, username, password, mailboxName!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "Exchange Server OAuth") {
            // check if null, undefined, empty.
            if (trim(this.protocol) && trim(this.host) && trim(this.port) && trim(this.username)) {
                mailOptions = {
                    "protocol": this.protocol.toLowerCase(),
                    "host": this.host,
                    "port": this.port,
                    "username": this.username,
                    "password": this.password,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "sourceFolderName": this.sourceFolderName,
                    "clientID": this.clientID,
                    "clientSecret": this.clientSecret,
                    "authorizationToken": tokenObj.accessToken,
                    "module": module,
                    "proxyUse": this.proxyUse
                };
            } else {
                error = "Please input the mandatory values, such as protocol, host, port, username!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "Exchange Server OAuth SharedInbox") {
            // check if null, undefined, empty.
            if (trim(this.protocol) && trim(this.host) && trim(this.port) && trim(this.username) && trim(this.mailboxName)) {
                mailOptions = {
                    "protocol": this.protocol.toLowerCase(),
                    "host": this.host,
                    "port": this.port,
                    "username": this.username,
                    "password": this.password,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "sourceFolderName": this.sourceFolderName,
                    "mailboxName": this.mailboxName,
                    "clientID": this.clientID,
                    "clientSecret": this.clientSecret,
                    "authorizationToken": tokenObj.accessToken,
                    "module": module,
                    "proxyUse": this.proxyUse
                };
            } else {
                error = "Please input the mandatory values, such as protocol, host, port, username, mailboxName!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "EWS") {
            // check if null, undefined, empty.
            if (trim(this.username) && trim(this.password)) {
                mailOptions = {
                    "username": this.username,
                    "password": this.password,
                    "uri": this.ewsUrl,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "sourceFolderName": this.sourceFolderName
                };
            } else {
                error = "Please input the mandatory values, such as protocol, username, password!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "EWS SharedInbox") {
            // check if null, undefined, empty.
            if (trim(this.username) && trim(this.password) && trim(this.mailboxName)) {
                mailOptions = {
                    "username": this.username,
                    "password": this.password,
                    "uri": this.ewsUrl,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "sourceFolderName": this.sourceFolderName,
                    "mailboxName": this.mailboxName,
                    "useImpersonate": this.useImpersonate
                };
            } else {
                error = "Please input the mandatory values, such as protocol, username, password, mailboxName!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "EWS OAuth") {
            if (trim(this.username) && trim(this.clientID) && trim(this.tenantID) && trim(this.clientSecret)) {
                mailOptions = {
                    "username": this.username,
                    "uri": this.ewsUrl,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "proxyType": this.proxyType,
                    "sourceFolderName": this.sourceFolderName,
                    "clientID": this.clientID,
                    "tenantID": this.tenantID,
                    "clientSecret": this.clientSecret,
                    "permissionType": this.permissionType,
                    "authorizationToken": tokenObj.accessToken
                };
            } else {
                error = "Please input the mandatory values, such as protocol, username, OAuth information!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "EWS OAuth SharedInbox") {
            if (trim(this.username) && trim(this.mailboxName) && trim(this.clientID) && trim(this.tenantID) &&
                trim(this.clientSecret)) {
                mailOptions = {
                    "username": this.username,
                    "uri": this.ewsUrl,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "proxyType": this.proxyType,
                    "sourceFolderName": this.sourceFolderName,
                    "mailboxName": this.mailboxName,
                    "clientID": this.clientID,
                    "tenantID": this.tenantID,
                    "clientSecret": this.clientSecret,
                    "permissionType": this.permissionType,
                    "authorizationToken": tokenObj.accessToken
                };
            } else {
                error = "Please input the mandatory values, such as protocol, username, mailboxName, OAuth information!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        } else if (this.serverType == "EWS OAuth Delegated" || this.serverType == "EWS OAuth Delegated SharedInbox") {
            var isParamValid = trim(this.clientID) && trim(this.tenantID) &&
                trim(this.clientSecret) && (!this.sharedInbox || trim(this.mailboxName));
            // username is not required for EWS auth code
            if (this.grantType != lib.OAuthAuthentication.grantTypeAuthCode()) {
                isParamValid = isParamValid && trim(this.username);
            }
            if (isParamValid) {
                mailOptions = {
                    "username": this.username,
                    "password": this.password,
                    "uri": this.ewsUrl,
                    "proxyHost": this.proxyHost,
                    "proxyPort": this.proxyPort,
                    "proxyUsername": this.proxyUsername,
                    "proxyPassword": this.proxyPassword,
                    "proxyType": this.proxyType,
                    "sourceFolderName": this.sourceFolderName,
                    "mailboxName": (this.sharedInbox ? this.mailboxName : ""),
                    "clientID": this.clientID,
                    "tenantID": this.tenantID,
                    "clientSecret": this.clientSecret,
                    "permissionType": this.permissionType,
                    "authorizationToken": tokenObj.accessToken
                };
            } else {
                error = "Please input the mandatory values, such as protocol, username" + (this.sharedInbox ? ", mailboxName" : "") + ", OAuth information!";
                this.logger.error('SmartEmailManagerClass', error);
                throw new Error(error);
            }
        }

        optionsJson = JSON.stringify(mailOptions);
        this.mailReceiver = new MailReceiver(this.serverType);
        try {
            if (isMailServer) {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', 'Open connection of the mail server.');
                }
                this.mailReceiver.open(optionsJson);
            }
            return ReturnCode.SUCCESS;
        } catch (e) {
            this.logger.error('SmartEmailManagerClass', e);
            return ReturnCode.CONNECTION_FAILURE;
        }
    },

    receiveMsgIdList: function(receivedUTCDate) {
        return this.mailReceiver.receiveMsgIdList(receivedUTCDate);
    },

    isScheduleBased: function() {
        return true;
    },

    /**
     * Get records from end point
     */
    readEmailIDs: function(isMailServer) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'readEmailIDs');
        }

        // call RTE API to retrieve email Ids, and call smis_TaskManager to push to SMISTaskQueue
        if (ReturnCode.CONNECTION_FAILURE == this.initMailReceiver(isMailServer)) {
            return ReturnCode.CONNECTION_FAILURE;
        }
        var startFrom = this.configItem.getConfigParameterValue("startFrom");
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'startFrom: ' + startFrom);
        }
        // format string mm/dd/yyyy HH:mm:ss
        var receivedUTCDate;
        if (startFrom) {
            receivedUTCDate = startFrom;
        } else {
            //If the startFrom Date is null, back to 24 hours ago of the current time as the receivedUTCDate.
            var hoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            receivedUTCDate = convertTime2String(hoursAgo);
        }
        var msgIdList;
        try {
            msgIdList = this.receiveMsgIdList(receivedUTCDate);
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "this.mailReceiver.receiveMsgIdList(receivedUTCDate): " + msgIdList);
            }
        } catch (e) {
            this.logger.error('SmartEmailManagerClass', e);
            return ReturnCode.CONNECTION_FAILURE;
        }

        var sourceField = this.username;
        // different shared mailbox maybe have the same username
        if (this.sharedInbox && (isEWS(this.protocol) || isIMAPs(this.protocol))) {
            if (lib.MailUtil.isEmailAddress(this.mailboxName)) {
                // store shared mailbox if it is email address
                sourceField = this.mailboxName;
            } else {
                // store username + shared mailbox if it is not email address
                sourceField = this.username + this.mailboxName;
            }
        }

        // var smis_interval = this.configItem.getConfigParameterValue("intervalTime");
        //smis_interval , back to one interval ago
        var lastReceivedTime = lib.SmartEmailUtil.getLastReceivedTimeForEmail(sourceField, 0, this.protocol);
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailManagerClass", "the last email received for user " + this.username + " is " + convertTime2String(lastReceivedTime));
        }

        var msgIdListObj = JSON.parse(msgIdList);
        var num = msgIdListObj.length;
        var i;
        for (i = 0; i < num; i++) {
            var msgtime = msgIdListObj[i].receivedUTCDate;
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("SmartEmailManagerClass", "the email received at " + msgtime);
            }
            if (!msgtime) {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', 'receivedUTCDate is empty, use current time instead');
                }
                msgtime = convertTime2String(new Date());
                msgIdListObj[i].receivedUTCDate = msgtime;
            }

            // if the receivedUTCDate/msgtime is later than startFrom, set the receivedUTCDate/msgtime as new startFrom
            if (convertString2Time(this.configItem.getConfigParameterValue("startFrom")) < convertString2Time(msgtime)) {
                this.configItem.setConfigParameterValue("startFrom", msgtime);
            } else if (!this.configItem.getConfigParameterValue("startFrom")) {
                this.configItem.setConfigParameterValue("startFrom", msgtime);
            }
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', 'Next time, the email will be processed after ' + msgtime);
            }

            lib.smis_ConfigurationManager.updateParam(this.configItem);

            var receivedTime = convertString2Time(msgtime);
            var ignored = false;

            if ((null != lastReceivedTime && receivedTime.getTime() < lastReceivedTime.getTime()) ||
                (null != startFrom && receivedTime.getTime() <= convertString2Time(startFrom).getTime())) {
                if (this.logger.isDebugEnabled()) {
                    var msg = null != lastReceivedTime ? lastReceivedTime : convertString2Time(startFrom);
                    this.logger.debug("SmartEmailManagerClass", "Ignore MSG " + msgIdListObj[i].msgId + "because the email received time is earlier than last received time: " + msg);
                }
                ignored = true;
            }

            if (!ignored) {
                var store = {};
                store["msgid"] = msgIdListObj[i].msgId;
                store["receivedtime"] = receivedTime;
                store["source"] = sourceField;
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', 'Try to save msgId ' + msgIdListObj[i].msgId + ' to table.');
                }
                if (lib.SmartEmailUtil.record_msgId(store, this.protocol)) {
                    if (this.logger.isDebugEnabled()) {
                        this.logger.debug("Email Task Queue", "Add MSG to Task Queue " + msgIdListObj[i].msgId);
                    }
                    var task = {};
                    task.intId = this.intId;
                    task.integrationName = "SmartEmail";
                    task.action = null;
                    task.object = null;
                    task.internalId = null;
                    task.externalId = null;
                    task.direction = lib.smis_Constants.MAPPING_DIRECTION_RIGHTLEFT();
                    task.inRecord = msgIdListObj[i];
                    var record = lib.SmartEmailUtil.find_msgId(store, this.protocol);
                    if (record.progress) {
                        if (this.logger.isDebugEnabled()) {
                            this.logger.debug('SmartEmailManagerClass', "The msgId has failed in " + lib.SmartEmailConstants.getSmartEmailFailureProgress(record.progress) + " last time.");
                        }
                        task.inRecord["progress"] = record.progress;
                    }
                    lib.smis_TaskManager.pushTask(task);
                } else {
                    if (this.logger.isDebugEnabled()) {
                        this.logger.debug("Email Task Queue", "Ignore MSG, because it is already in the table. " + msgIdListObj[i].msgId);
                    }
                }
            }
        }

        if (isMailServer) {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', 'Close connection of the mail server.');
            }
            this.mailReceiver.close();
        }

        return ReturnCode.SUCCESS;
    },

    /**
     * append records to tasklist
     */
    appendTasks: function() {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', "appendTasks");
        }

        // refresh refreshToken task
        if (this.isAuthCodeForGraph()) {
            var result = lib.SmartEmailTaskManager.newTaskForRefreshRefreshToken(this.configItem);
            if (result) {
                this.logger.info('SmartEmailManagerClass', "Refresh refreshToken task appended.");
            }
        }
    },

    /**
     * check whether is refresh refreshToken task
     */
    isRefreshTokenAction: function(task) {
        return (task.action == lib.SmartEmailConstants.ACTION_REFRESH_REFRESHTOKEN());
    },

    /**
     * Pre process of task
     */
    preProcess: function(task) {
        // download email, read attachment, and then set to task src fields
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'preProcess');
        }

        // ignore refresh refreshToken action
        if (this.isRefreshTokenAction(task)) {
            return ReturnCode.SUCCESS;
        }

        // Add it for auto test. If 'isMailServer' is false, the code will not connect to the mail server.
        var isMailServer = task.inRecord.isMailServer;
        // If we can not get value from task, it means that we need to connect to the real mail server, set isMailServer to true.
        if (isMailServer == undefined || isMailServer == null) {
            isMailServer = true;
        }

        var inRecord = task.inRecord;
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', "PreProcess Task:  " + JSON.stringify(inRecord));
        }

        if (task["expired"]) {
            this.logger.warn('SmartEmailManagerClass', "PreProcess task is expired.");
            return ReturnCode.SMIS_TASK_EXPIRED;
        }

        task.inRecord["attachmentList"] = null;

        var msgId = inRecord.msgId;
        var sender = inRecord.from;
        if (null != sender && null != sender[0]) {
            // change if the format is not [{}]
            sender = sender[0]["address"];
        } else {
            sender = null;
        }
        task['email.address'] = sender;

        if (!this.isValidDomain(sender)) {
            this.logger.error("Pre Validation", "Email from Invalid Domain will be ignored.  Email From:  " + sender);
            return ReturnCode.INVALID_DOMAIN;
        }

        var contactInfo = lib.SmartEmailSecurityUtils.getContactInfoByEmail(sender);
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('Pre Validation contact', JSON.stringify(contactInfo));
        }
        var operatorName = this.getOperatorNameByContactInfo(contactInfo);

        // check if sm operator
        if (operatorName == null) {
            this.logger.error("Pre Validation", "Email from non SM operator will be ignored.  Email From:  " + sender);
            return ReturnCode.INVALID_OPERATOR;
        }
        task['operator'] = operatorName;

        var mailSize = inRecord.mailSize;
        if (this.mailSizeCheck && mailSize > this.maxMailSize) {
            this.logger.error("Pre Validation", "Email size exceeding the email size restrictions will be ignored.  Email size:  " + mailSize);
            return ReturnCode.EXCEED_SIZE_LIMITATION;
        }

        var mailMessage = {};
        try {
            if (!task.inRecord["body"]) {
                var filePath;
                if (isMailServer) {
                    filePath = this.mailReceiver.receive(msgId);
                } else {
                    filePath = inRecord.filePath;
                }
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', "filePath: " + filePath);
                }
                var mailMessageStr = this.mailReceiver.readMessage(filePath);
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', "this.mailReceiver.readMessage(filePath): " + mailMessageStr);
                }
                mailMessage = JSON.parse(mailMessageStr);
                if (mailMessage.errorType) {
                    this.logger.warn("Pre Validation", "Ignored an unsupported email because the mimeType is " + mailMessage.errorType + ". MSG id: " + msgId);
                    return ReturnCode.UNSUPPORT_EMAIL;
                }

                if (mailMessage.body) {
                    //decode emoji like &#x1F60A; and &#128523;
                    mailMessage.body = lib.EmojiUtil.convertUnicode2Emoji(mailMessage.body);
                    if (mailMessage.contentType && mailMessage.contentType.indexOf("text/plain") >= 0) {
                        // do not remove tag
                        mailMessage.body = lib.SmartEmailUtil.resolvePlainText(mailMessage.body);
                    } else {
                        mailMessage.body = lib.SmartEmailUtil.removeTag(mailMessage.body);
                    }
                }
                task["receivedUTCDate"] = convertString2Time(mailMessage.receivedUTCDate);

                if (mailMessage.subject) {
                    mailMessage.subject = lib.EmojiUtil.convertUnicode2Emoji(mailMessage.subject);
                }
                task.subject = mailMessage.subject;
                task.inRecord = mailMessage;
                task.inRecord["msgId"] = msgId;
                if (this.isEmptyEmail(task.inRecord)) {
                    this.logger.warn("Pre Validation", "If the email's subject, body is empty and do not has attachment, the email will be ignored. MSG id: " + msgId);
                    return ReturnCode.EMPTY_EMAIL;
                }

                // get contact name
                task['contact.info'] = contactInfo;
                task.inRecord["filePath"] = filePath;
                task.inRecord['contact'] = contactInfo.name;
                task.inRecord['email.address'] = sender;

                if (!lib.ArrayUtil.isEmptyString(mailMessage.autoReply)) {
                    if (this.logger.isDebugEnabled()) {
                        this.logger.debug("Pre Validation", "Auto reply email will be ignored. MSG id: " + msgId);
                    }
                    return ReturnCode.AUTO_REPLY;
                }

                if (mailMessage.hasAttachments) {
                    var attachmentList = this.mailReceiver.readAttachments(filePath);
                    if (attachmentList.startsWith("Ignored an unsupported email because")) {
                        this.logger.info("Pre Validation", attachmentList + " MSG id: " + msgId);
                        return ReturnCode.UNSUPPORT_EMAIL;
                    }
                    if (this.logger.isDebugEnabled()) {
                        this.logger.debug("Pre Validation", "attachmentList: " + attachmentList);
                    }
                    task.inRecord["attachmentList"] = attachmentList;
                }

                lib.smis_TaskManager.updateTask(task);
            }
        } catch (e) {
            this.logger.error('Pre Validation', e);
            return ReturnCode.CONNECTION_FAILURE;
        }

        var object = this.configItem.getConfigParameterValue("object");
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('Pre Validation', "this.configItem.getConfigParameterValue('object'): " + object);
        }
        object = lib.SmartEmailUtil.getObjectNameByOption(object); // Convert the object to sm object name

        var keyField;
        var query;
        var ret;

        if (lib.SmartEmailUtil.containsToken(mailMessage.body)) {
            var token = lib.SmartEmailUtil.captureToken(mailMessage.body);
            task.action = "update";
            token = lib.MailUtil.decryptToken(token);
            if (token) {
                mailMessage.body = lib.SmartEmailUtil.removeToken(mailMessage.body);
                var data = lib.SmartEmailUtil.parseToken(token);
                if (mailMessage.contentType && mailMessage.contentType.indexOf("text/plain") >= 0) {
                    // try to resolve add comments line.
                    mailMessage.body = lib.SmartEmailUtil.resolvePlainText(mailMessage.body, data["action"], task["operator"]);
                }
                task.inRecord['token'] = data;
                task.internalId = data["id"];

                task.object = data['file'];
                task.name = data['name'];
                if (data['recipient'].toLowerCase() != sender.toLowerCase()) {
                    this.logger.error("Pre Validation", "Token is usurped. " + msgId);
                    return ReturnCode.TOKEN_USURPED;
                }

                if (lib.SmartEmailUtil.isTokenUsed(data)) {
                    this.logger.error("Pre Validation", "Token been used. " + msgId);
                    return ReturnCode.TOKEN_BEEN_USED;
                }

                if (lib.SmartEmailUtil.isTokenExpiration(data)) {
                    this.logger.error("Pre Validation", "Token expired. " + msgId);
                    return ReturnCode.TOKEN_EXPIRED;
                }

                if (this.logger.isDebugEnabled()) {
                    this.logger.debug("Pre Validation", "Outbound Email Token found, going to update ticket.  MSG id: " + msgId);
                }

                task.internalObject = new SCFile(data['file']);
                keyField = lib.SmartEmailUtil.getUniqueKeyField(data['file']);
                task.inRecord['keyField'] = keyField;
                query = keyField + "=\"" + data["id"] + "\"";
                ret = task.internalObject.doSelect(query);
                if (ret != RC_SUCCESS) {
                    this.logger.warn("Pre Validation", "Ticket is not found. MSG id:  " + msgId);
                    return ReturnCode.RECORD_NOT_FOUND;
                }
            } else {
                this.logger.error("Pre Validation", "Failed to decrypt token.");
                return ReturnCode.TOKEN_DECRYPT_FAILED;
            }
        } else {
            task.action = "add";

            if (this.newEmailUpdate) {
                var id = lib.SmartEmailUtil.parseUpdateTagID(mailMessage.subject);
                if (id != null) {
                    var obj = lib.SmartEmailUtil.getObjectNameFromID(id);
                    if (obj != null && obj == object) {
                        var file = new SCFile(obj);
                        keyField = lib.SmartEmailUtil.getUniqueKeyField(obj);
                        query = keyField + "=\"" + id + "\"";
                        ret = file.doSelect(query);
                        if (ret == RC_SUCCESS) {
                            task.action = "update";
                            task.internalId = id;
                            task.object = obj;
                            task.internalObject = file;
                            task.inRecord['keyField'] = keyField;
                            task.inRecord['token'] = {}; // pseudo token
                            task.inRecord['token']['file'] = obj;
                            task.inRecord['token']['id'] = id;
                            task.inRecord['token']['action'] = "update";
                            if (this.logger.isDebugEnabled()) {
                                this.logger.debug("Pre Validation", "Outbound Email ticket id found, going to update ticket. MSG id:  " + msgId);
                            }
                        } else {
                            if (this.logger.isDebugEnabled()) {
                                this.logger.debug("Pre Validation", "Ticket" + id + " is not found. MSG id:  " + msgId);
                            }
                        }
                    }
                }
            }

            if (task.action == "add") {
                task.object = object;
                task.internalObject = new SCFile(task.object);
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug("Pre Validation", "No token found, will create ticket.");
                }
            }
        }

        // remove empty lines from body
        var body = task.inRecord.body;
        while (body && body.length >= 1 && lib.SmartEmailUtil.trim(body[body.length - 1]) == '') {
            body.pop();
        }

        return ReturnCode.SUCCESS;
    },

    getAction: function() {
        return this.action;
    },

    getDestObj: function() {
        //return this.obj;
    },

    /**
     * process the task in queue
     */
    process: function(task) {

        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'process');
            this.logger.debug("SmartEmailManagerClass", "task.inRecord: " + JSON.stringify(task.inRecord));
            this.logger.debug("SmartEmailManagerClass", "task.internalObject: " + task.internalObject);
        }

        // refresh refreshToken action
        if (this.isRefreshTokenAction(task)) {
            var module = task.internalId;
            var result = lib.AzureAuthentication.refreshRefreshToken(this.configItem, module);
            var error = result.error;

            if (error) {
                this.logger.error('SmartEmailManagerClass', JSON.stringify(error));

                task.responseCode = error.code;
                task.responseMsg = error.message;
                lib.smis_TaskManager.updateTask(task);
                return ReturnCode.SERVER_ERROR;
            }

            this.logger.info("SmartEmailManagerClass", `refresh refresh token for "${module}".`);

            return ReturnCode.SUCCESS;
        }

        var resultCode = ReturnCode.SUCCESS;

        var inRecord = task.inRecord;

        //lib.smis_TaskManager.updateTask(task);
        if (this.logger.isDebugEnabled()) {
            this.logger.debug("SmartEmailManagerClass", "this.SMAdapter.sendRecord(), task: " + JSON.stringify(task));
        }

        try {
            resultCode = this.SMAdapter.sendRecord(task, task.action);
        } catch (ex) {
            return ReturnCode.SERVER_ERROR;
        }

        // when update email doesn't include valid field and value, skip to save the email as attachment
        if (this.isUpdateTask(task) && task["updateFieldValueList"] && task["updateFieldValueList"].length == 0) {
            return resultCode;
        }

        if (ReturnCode.SUCCESS == resultCode) {
            var filePath = inRecord.filePath;
            if (this.logger.isDebugEnabled()) {
                this.logger.debug("SmartEmailManagerClass", "inRecord.filePath: " + filePath);
            }

            // save .eml as an attachment
            var fileName = task.object;
            if (fileName == 'incidents' || fileName == 'probsummary' || fileName == 'rootcause' || fileName == 'request' || fileName == 'cm3r' || fileName == 'cm3t') {
                var fileId = task.internalId;
                var fileIdName = lib.SmartEmailUtil.getUniqueKeyField(fileName);
                var query = fileIdName + "=\"" + fileId + "\"";
                var scFile = new SCFile(fileName, SCFILE_READONLY);
                var res = scFile.doSelect(query);
                if (res == RC_SUCCESS) {
                    var smattach = new Attachment();
                    var name = lib.SmartEmailUtil.resolveSubjectFilename(inRecord.subject);
                    smattach.type = "application/octet-stream";
                    //QCCR1E145806
                    smattach.name = name.substring(0, lib.SmartEmailConstants.MAX_ATTACHMENT_FILENAME()) + ".eml";
                    smattach.value = readFile(filePath, "b");
                    vars.$attachmentFromEmail = true;
                    var smAttachId = scFile.insertAttachment(smattach);
                    vars.$attachmentFromEmail = false;
                    if (this.emailArchive) {
                        var emailRecord = {};
                        emailRecord["user.from"] = task["email.address"];
                        emailRecord["user.to"] = this.username;
                        emailRecord["reference.id"] = fileId;
                        emailRecord["type"] = "inbound";
                        emailRecord["received.time"] = task["receivedUTCDate"];
                        emailRecord["subject"] = task["subject"];
                        emailRecord["uid"] = [];
                        emailRecord["uid"].push(smAttachId.replace(/^cid:/, ""));
                        lib.EmailArchivingUtil.backupEmailIn(emailRecord);
                    }

                    var attachmentList = task.inRecord["attachmentList"];
                    var enableStoreAttachments = lib.settings.getSettingValue("SmartEmail", "enableStoreAttachments");
                    if (enableStoreAttachments == "true" && attachmentList && !attachmentList.startsWith("Ignored an unsupported email because")) {
                        this.logger.info("SmartEmailManagerClass", "Trying to save the email attachments.");
                        var attachments = JSON.parse(attachmentList);
                        var i;
                        var content;
                        var rc;
                        for (i = 0; i < attachments.length; i++) {
                            if (!lib.AttachmentUtil.isAttachmentAllowed(attachments[i]["fileName"])) {
                                this.logger.warn("SmartEmailManagerClass", "The attachment file is not allowed: " + attachments[i]["fileName"]);
                                continue;
                            }
                            if (!lib.AttachmentUtil.checkMaxAttachmentSize(attachments[i]["fileSize"], task["operator"])) {
                                this.logger.warn("SmartEmailManagerClass", "The attachment size exceeds the limit: " + attachments[i]["fileName"]);
                                continue;
                            }
                            if (!lib.AttachmentUtil.checkTotalAttachmentSize(fileName, fileId, attachments[i]["fileSize"], task["operator"])) {
                                this.logger.warn("SmartEmailManagerClass", "The total attachment size exceeds the limit after add the file: " + attachments[i]["fileName"]);
                                continue;
                            }
                            smattach = new Attachment();
                            smattach.type = "application/octet-stream";
                            smattach.name = lib.AttachmentUtil.adjustAttachmentName(fileName, fileId, attachments[i]["fileName"]);
                            content = readFile(attachments[i]["filePath"], "b");
                            if (content == -1) {
                                this.logger.warn("SmartEmailManagerClass", "Failed to read the content of the file: " + smattach.name);
                                continue;
                            }
                            smattach.value = content;
                            rc = checkAttachmentLegal(smattach);
                            if (rc != RC_SUCCESS) {
                                this.logger.warn("SmartEmailManagerClass", "The content of the attachment doesn't match its file extension: " + smattach.name);
                                continue;
                            }
                            vars.$attachmentFromEmail = true;
                            smAttachId = scFile.insertAttachment(smattach);
                            vars.$attachmentFromEmail = false;
                            this.logger.info("SmartEmailManagerClass", "Added the attachment: " + smattach.name);
                        }
                    }
                } else {
                    return ReturnCode.SERVER_ERROR;
                }
            }
        }

        return resultCode;
    },

    /**
     * post process
     */
    postProcess: function(task, processStatusCode) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'postProcess');
        }

        // ignore refresh refreshToken action
        if (this.isRefreshTokenAction(task)) {
            return ReturnCode.SUCCESS;
        }

        if (lib.SmartEmailReturnCode.isHandleProcessedReturnCode(processStatusCode) ||
            lib.SmartEmailReturnCode.isIgnoredReturnCode(processStatusCode)) {
            return this.handleProcessedTask(task);
        } else {
            return this.handleFailedTask(task);
        }
    },

    handleProcessedTask: function(task) {
        return this.moveorDeleteEmail(task, this.removeEmail, this.processedFolder);
    },

    handleFailedTask: function(task) {
        return this.moveorDeleteEmail(task, false, this.errorFolder);
    },

    errorHandling: function(errorCode, task) {
        var index = lib.ArrayUtil.indexOf(this.errorCodes, errorCode);

        if (index < 0) {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "Not Configured Error Case happens, Ignore it." + errorCode);
            }
            return;
        }

        var smisErrorMessage = [];
        var emailSubject = "";
        var emailBody = "";
        var emailRecipients = [];

        var refId = "";
        if (task && task["internal.id"]) {
            refId = task["internal.id"];
        }

        if (this.errorCases.length - 1 >= index) {
            emailSubject = this.errorCases[index];
        }

        if (1 == this.emailSenders[index] || 1 == this.emailOthers[index] || 1 == this.emailAdmins[index]) {
            if (this.errorMessages.length - 1 >= index) {
                emailBody = this.errorMessages[index];
            }
        }

        var tempSubject = getEmailSubject(emailSubject, null);
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', "Handling SmartEmail ErrorCode: " + errorCode + "[" + tempSubject + "].");
        }

        if (1 == this.createIncidents[index]) {
            // not create duplication error incident for connection failure
            if (lib.SmartEmailReturnCode.ifNeedRecoveredReturnCode(errorCode) && this.isIncidentOpened(errorStatus[this.configItem.name]['E' + errorCode])) {
                smisErrorMessage.push("Incident " + errorStatus[this.configItem.name]['E' + errorCode] + " already been created");
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', "Error incident already created and not closed.");
                }
            } else {
                var intID = this.createErrorIncident(task, tempSubject, errorCode);
                if (intID) {
                    smisErrorMessage.push("Incident " + intID + " is created");
                }
            }
        }

        var tmpSub;
        var tmpBody;

        if (1 == this.emailSenders[index]) {
            if (task && task['email.address']) {
                emailRecipients = [];
                emailRecipients.push(task['email.address']);
                tmpSub = getEmailSubject(emailSubject, task['email.address']);
                tmpBody = getEmailBody(emailBody, task['email.address']) + lib.SmartEmailUtil.getOriginatingEmailInfo(task, task['email.address'], true) +
                    lib.SmartEmailUtil.getUpdateFieldValuesEmailInfo(task, task['email.address']);
                sendEmail(emailRecipients, tmpSub, tmpBody, refId);
                smisErrorMessage.push("Email Send to Sender: " + emailRecipients.join(","));
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', "Email error " + errorCode + " [" + tempSubject + "] to Sender:" + emailRecipients);
                }
            } else {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', "No Sender info found, ignore send email to sender.");
                }
            }
        }

        if (1 == this.emailOthers[index]) {
            if (null == this.othersEmail) {
                this.logger.error('SmartEmailManagerClass', "When set Email to Others to Yes, need provide Others Emails.");
            } else {
                emailRecipients = [];
                var tempEmails = this.othersEmail.split("~");
                var i;
                for (i = 0; i < tempEmails.length; i++) {
                    var tempEmail = lib.SmartEmailUtil.populateRecipient(tempEmails[i]);
                    if (tempEmail) {
                        emailRecipients.push(tempEmail);
                    } else {
                        this.logger.error('SmartEmailManagerClass', tempEmails[i] + "configured in OthersEmail is been ignored , for it is not email address nor SM operator.");
                    }
                }
                if (emailRecipients.length == 0) {
                    this.logger.error('SmartEmailManagerClass', "When set Email to Others to Yes, need provide Others Emails.");
                } else {
                    var len = emailRecipients.length;
                    for (i = 0; i < len; i++) {
                        var tmpRec = [];
                        tmpRec.push(emailRecipients[i]);
                        tmpSub = getEmailSubject(emailSubject, emailRecipients[i]);
                        tmpBody = getEmailBody(emailBody, emailRecipients[i]) + lib.SmartEmailUtil.getOriginatingEmailInfo(task, emailRecipients[i], false) +
                            lib.SmartEmailUtil.getUpdateFieldValuesEmailInfo(task, emailRecipients[i]);
                        sendEmail(tmpRec, tmpSub, tmpBody, refId);
                        if (this.logger.isDebugEnabled()) {
                            this.logger.debug('SmartEmailManagerClass', "Email error " + errorCode + "[" + tempSubject + "] to Others:" + tmpRec);
                        }
                    }
                    smisErrorMessage.push("Email Send to Others: " + emailRecipients.join(","));
                }
            }
        }

        if (1 == this.emailAdmins[index]) {
            if (null == this.adminEmail) {
                this.logger.error('SmartEmailManagerClass', "When set Email to Admin to Yes,  need provide Admin Email.");
            } else {
                var recipient = lib.SmartEmailUtil.populateRecipient(this.adminEmail);
                if (null == recipient) {
                    this.logger.error('SmartEmailManagerClass', this.adminEmail + "configured in Admin Email is been ignored , for it is not email address nor SM operator.");
                } else {
                    emailRecipients = [];
                    emailRecipients.push(recipient);
                    tmpSub = getEmailSubject(emailSubject, recipient);
                    tmpBody = getEmailBody(emailBody, recipient) + lib.SmartEmailUtil.getOriginatingEmailInfo(task, recipient, false) +
                        lib.SmartEmailUtil.getUpdateFieldValuesEmailInfo(task, recipient);
                    sendEmail(emailRecipients, tmpSub, tmpBody, refId);
                    smisErrorMessage.push("Email Send to Admin: " + emailRecipients.join(","));
                    if (this.logger.isDebugEnabled()) {
                        this.logger.debug('SmartEmailManagerClass', "Email error " + errorCode + "[" + tempSubject + "] to Admin:" + emailRecipients);
                    }
                }
            }
        }

        if (lib.SmartEmailReturnCode.ifNeedRecoveredReturnCode(errorCode)) {
            // remove record from store
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "Trying to recover task by add a flag at the record from store");
            }
            if (task && task.inRecord.progress) {
                lib.SmartEmailUtil.update_msgId(task.inRecord.msgId, this.protocol, task.inRecord.progress, lib.SmartEmailConstants.SMARTEMAIL_MSGID_NOT_INQUE());
            }
        }

        var tempMess = smisErrorMessage.join(",");
        if (task) {
            if (tempMess) {
                task.responseMsg = tempMess + " for error: " + errorCode + " [" + tempSubject + "]";
            } else {
                task.responseMsg = "Error " + errorCode + " [" + tempSubject + "] happens without further action.";
            }
        }
    },

    ignoreHandling: function(errorCode, task) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'ignore this mail: errorCode ' + errorCode);
        }

        if (task) {
            var msgId = "ec_ignoreMail_" + errorCode;
            task.responseMsg = funcs.scmsg(msgId, "SmartEmail");
        }
    },

    successHandling: function(task) {
        // only works for update email
        if (!this.isUpdateTask(task)) {
            return;
        }

        var refId = "";
        if (task["internal.id"]) {
            refId = task["internal.id"];
        }

        var address = task['email.address'];
        if (address) {
            var updateFieldValueInfo = lib.SmartEmailUtil.getUpdateFieldValuesEmailInfo(task, address);

            var tmpSub;
            var tmpBody;
            if (updateFieldValueInfo.length > 0) { // no valid field and value
                tmpSub = lib.MailUtil.getEmailMessage("ufv_email_subject", "SmartEmail", address);
                tmpBody = lib.MailUtil.getEmailMessage("ufv_email_body", "SmartEmail", address);
            } else {
                tmpSub = lib.MailUtil.getEmailMessage("ufv_email_subject_invalid", "SmartEmail", address);
                tmpBody = lib.MailUtil.getEmailMessage("ufv_email_body_invalid", "SmartEmail", address);
            }
            tmpBody += lib.SmartEmailUtil.getOriginatingEmailInfo(task, address, true) + updateFieldValueInfo;

            sendEmail([address], tmpSub, tmpBody, refId);

            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "Send email about update field value to Sender:" + address);
            }
        } else {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "No Sender info found, ignore send email to sender about update field value.");
            }
        }
    },

    isUpdateTask: function(task) {
        return (task && task["inRecord"] && task["inRecord"]["token"] && task["inRecord"]["token"]["action"] == "update" &&
            task["action"] == "update");
    },

    createErrorIncident: function(task, tempSubject, errorCode) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass, this.incidentTitle', this.incidentTitle);
            this.logger.debug('SmartEmailManagerClass, this.incidentAssignmentGroup', this.incidentAssignmentGroup);
            this.logger.debug('SmartEmailManagerClass, this.incidentImpact', this.incidentImpact);
            this.logger.debug('SmartEmailManagerClass, this.incidentUrgency', this.incidentUrgency);
            this.logger.debug('SmartEmailManagerClass, this.incidentCategory', this.incidentCategory);
            this.logger.debug('SmartEmailManagerClass, this.incidentSubcategory', this.incidentSubcategory);
            this.logger.debug('SmartEmailManagerClass, this.incidentArea', this.incidentArea);
            this.logger.debug('SmartEmailManagerClass, this.incidentAffectedService', this.incidentAffectedService);
        }

        var inci = new SCFile("probsummary");

        inci["brief.description"] = this.incidentTitle;
        inci["assignment"] = this.incidentAssignmentGroup;
        inci["initial.impact"] = this.incidentImpact;
        inci["severity"] = this.incidentUrgency;

        inci["category"] = this.incidentCategory;
        inci["subcategory"] = this.incidentSubcategory;
        inci["product.type"] = this.incidentArea;
        inci["affected.item"] = this.incidentAffectedService;
        // description
        inci["action"] = [];
        inci["action"].push(tempSubject);
        inci["action"].push('***********************');

        var server;
        if (isEWS(this.protocol)) {
            server = this.ewsUrl;
        } else {
            server = this.host;
        }

        var emailAddress = '';
        var operatorName = '';
        var internalId = '';
        var taskId = '';
        if (task) {
            emailAddress = task['email.address'] || '';
            operatorName = task['operator'] || '';
            internalId = task.internalId || '';
            taskId = task.id || '';
        }
        inci["action"].push('Inbound email server: ' + server);
        inci["action"].push('Sender email address: ' + emailAddress);
        inci["action"].push('Sender name: ' + operatorName);
        inci["action"].push('Record ID: ' + internalId);
        var tokenAction = '';
        if (task) {
            if (task.action == 'add') {
                tokenAction = 'add';
            } else {
                if (task.inRecord['token']) {
                    tokenAction = task.inRecord['token']['action'];
                }
            }
        }
        inci["action"].push('Action to be taken: ' + tokenAction);
        inci["action"].push('SMIS task ID: ' + taskId);
        inci["action"].push('Fields list of validation error: ');
        inci["action"].push('***********************');

        var ret = inci.doAction('add');
        if (ret == RC_SUCCESS) {
            errorStatus[this.configItem.name]['E' + errorCode] = inci["number"];
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "Incident " + inci["number"] + " created for error" + errorCode + "[" + tempSubject + "]");
            }
            if (task) {
                //task.responseMsg = "Incident " + inci["number"] + " created for error " + errorCode +"[" + tempSubject + "]";
                return inci["number"];
            }
        } else {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "Create Incident for error " + errorCode + "[" + tempSubject + "] failed.  for " + RCtoString(ret));
            }
        }

        return null;
    },

    isIncidentOpened: function(incidentId) {
        if (!incidentId) {
            return false;
        }
        var isIncidentOpened = false;
        var incident = new SCFile("probsummary", SCFILE_READONLY);
        var fields = ["number", "status"];

        incident.setFields(fields);

        var findIncident = incident.doSelect("number=\"" + incidentId + "\"");

        if (findIncident == RC_SUCCESS) {
            if (incident.status != "closed") {
                isIncidentOpened = true;
            }
        }

        return isIncidentOpened;
    },

    /**
     * Check email's subject, body is empty and do not have attachment.
     */
    isEmptyEmail: function(inRecord) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'Validate Email is empty or not');
        }

        return inRecord.subject == "" && inRecord.body == "" && !inRecord.hasAttachments;
    },

    /**
     * Check Sender is from authorized domain
     */
    isValidDomain: function(sender) {
        var result = false;
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'Validate Sender Email Domain');
        }

        if (null == sender) {
            result = false;
        } else {
            var index = sender.indexOf("@");
            var len = sender.length;
            if (index > 0 && index + 1 < len) {
                result = lib.ArrayUtil.contains(this.validDomains, sender.slice(index + 1, len));
            }
        }

        return result;
    },

    getOperatorNameByContactInfo: function(cont) {
        if (null == cont) {
            return null;
        }

        var ope = cont["operator.id"];
        if (null == ope || "" == ope) {
            if (this.useDefaultOperator && lib.SmartEmailSecurityUtils.isValidOperator(this.defaultOperator)) {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('getOperatorNameByContactInfo', "No operator is associated with contact \"" + cont["name"] + "\", default operator \"" + this.defaultOperator + "\" is used");
                }
                return this.defaultOperator;
            }

            return null;
        }
        return ope;
    },

    hasNewRight: function(operator, object, right) {
        return lib.SmartEmailSecurityUtils.checkRight(operator, object, right);
    },

    moveorDeleteEmail: function(task, removeEmail, folder) {
        // The option of deleting mail is prior to move mail.
        if (removeEmail) {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', "Delete email from mail server");
            }
            try {
                this.mailReceiver.deleteMessage(task.inRecord.msgId);
            } catch (e) {
                this.logger.error('SmartEmailManagerClass', "Can not delete the mail. Exception: " + e);
                return ReturnCode.CONNECTION_FAILURE;
            }
        } else if (folder) {
            if (!isPOP3orPOP3s(this.protocol.toLowerCase())) {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', "Move email to folder: " + folder);
                }
                var jsonParam = {
                    "msgId": task.inRecord.msgId,
                    "folder": folder
                };
                try {
                    this.mailReceiver.moveMessage(JSON.stringify(jsonParam));
                } catch (e) {
                    this.logger.error('SmartEmailManagerClass', "Can not move the mail. Exception: " + e);
                    return ReturnCode.CONNECTION_FAILURE;
                }
            } else {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass', "POP3 or POP3s can not move email.");
                }
            }
        } else {
            if (this.logger.isDebugEnabled()) {
                if (!isPOP3orPOP3s(this.protocol.toLowerCase())) {
                    this.logger.debug('SmartEmailManagerClass', "For processed email, cause the checkbox 'Delete Email when successfully processed' is not selected and 'Processed Email Folder' is not entered. \nFor failed email, cause the 'Error Email Folder' is not entered. \nThe email will not be moved or deleted.");
                } else {
                    this.logger.debug('SmartEmailManagerClass', "The checkbox 'Delete Email when successfully processed' is not selected. The email will not be deleted. ");
                }
            }
        }

        return ReturnCode.SUCCESS;
    },

    /**
     * finalize work
     */
    finalize: function(task) {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', 'finalize');
        }

        // ignore refresh refreshToken action
        if (this.isRefreshTokenAction(task)) {
            delete task.inRecord;
            return;
        }

        // delete .eml file which is in the disk.
        var file = task.inRecord.filePath;
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass - task.inRecord', JSON.stringify(task.inRecord));
        }

        // the value of isMailServer in task.inRecord is null generally except that it is false when autotest
        var isMailServer = task.inRecord.isMailServer;
        if (isMailServer == undefined || isMailServer == null) {
            isMailServer = true;
        }

        // delete file only from mail server or task status is not waiting (need to retry)
        if (file && (isMailServer || task.status != lib.smis_Constants.TASK_STATUS_WAITING())) {
            try {
                if (this.logger.isDebugEnabled()) {
                    this.logger.debug('SmartEmailManagerClass - try to delete file', file);
                }
                deleteFile(file);
            } catch (e) {
                this.logger.error('SmartEmailManagerClass', "Can not delete the temp file " + file + ". Exception: " + e);
            }

            // delete attachments of email
            var attachmentList = task.inRecord["attachmentList"];
            if (attachmentList && !attachmentList.startsWith("Ignored an unsupported email because")) {
                var attachments = JSON.parse(attachmentList);
                if (attachments) {
                    var i;
                    var attachment;
                    for (i = 0; i < attachments.length; i++) {
                        attachment = attachments[i]["filePath"];
                        if (this.logger.isDebugEnabled()) {
                            this.logger.debug('SmartEmailManagerClass - try to delete attachment ', attachments[i]["fileName"] + " " + attachment);
                        }
                        try {
                            deleteFile(attachment);
                        } catch (e) {
                            this.logger.error('SmartEmailManagerClass', "Can not delete the temp attachment file " + attachment + ". Exception: " + e);
                        }
                    }
                }
            }
        }

        if (isMailServer) {
            if (this.logger.isDebugEnabled()) {
                this.logger.debug('SmartEmailManagerClass', 'Close connection of the mail server.');
            }
            this.mailReceiver.close();
        }

        delete task.internalObject;
        delete task.inRecord;
    },

    isAuthCodeForGraph: function() {
        return (isEWSGraph(this.protocol) || (isEWS(this.protocol) && this.enableOAuth && this.permissionType == "Delegated")) &&
            this.grantType == lib.OAuthAuthentication.grantTypeAuthCode();
    },

    beforeEnableInstance: function() {
        // check access token first in auth code grant type
        if (this.isAuthCodeForGraph() || (isIMAPs(this.protocol) && this.enableOAuth)) {
            var module = lib.SmartEmailUtil.getSmartEmailTokenModule(this.intId);

            var ftoken = lib.OAuthAuthentication.getOAuthTokenByModule(module);
            if (!lib.OAuthAuthentication.isTokenAvailable(ftoken)) {
                funcs.rtecall("msg", new SCDatum(), funcs.scmsg("73", "smis"), 2);
                return false;
            }
        }

        return true;
    },

    enableInstance: function() {
        if (this.logger.isDebugEnabled()) {
            this.logger.debug('SmartEmailManagerClass', "Enabling instance.");
        }
        delete errorStatus[this.configItem.name];
    },


    validateParams: function() {
        /*
         * most old mandatory check are in formatctrl "smis_InboundEmail"
         * move new check here to align with SMIS framework and easy to maintain
         */
        var mandatoryList = [];

        // username is mandatory 
        mandatoryList.push("username");

        // password, except:
        // 1. graph with auth code; 2. IMAPs/EWS with oauth enable
        if (!this.isAuthCodeForGraph() && (!this.enableOAuth || (!isIMAPs(this.protocol) && !isEWS(this.protocol)))) {
            mandatoryList.push("password");
        }

        if (mandatoryList.length > 0) {
            var result = lib.smis_CommonLib.validateSMISParams(this.configItem, mandatoryList, "SmartEmail");
            if (result) {
                return result;
            }
        }

        return null;
    },

    afterDelInstance: function() {
        // clear oauth data
        const module = lib.SmartEmailUtil.getSmartEmailTokenModule(this.intId);
        lib.OAuthAuthentication.clearOAuthData(module);
    }

});

function getClass() {
    return SmartEmailManagerClass;
}