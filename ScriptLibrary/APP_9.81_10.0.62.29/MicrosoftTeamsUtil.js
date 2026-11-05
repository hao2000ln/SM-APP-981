var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsUtil");

var API = lib.MicrosoftGraphAPI;

const TEMPLATE_TEAMS = lib.MicrosoftTeamsConstants.TEMPLATE_TEAMS();
const TOKEN_TEAMS_PREFIX = lib.MicrosoftTeamsConstants.API_MODULE() + '-';
const TOKEN_BOT_PREFIX = lib.MicrosoftTeamsConstants.BOT_MODULE() + '-';


/**
 * parse Graph API response
 *
 * @param {String} response
 * @returns {Object} standard API response format
 */
function parseResponse(response) {
    return lib.AzureAuthentication.parseResponse(response);
}


/**
 * set log level, make all logs' level same as integration setting
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    level = level ? level.toLowerCase() : "info";
    if (level == "off") {
        level = "fatal";
    }

    logger.setLevel(level);

    lib.MicrosoftTeamsTeam.setLoggerLevel(level);
    lib.MicrosoftTeamsChannel.setLoggerLevel(level);
    lib.MicrosoftTeamsMessage.setLoggerLevel(level);
    lib.MicrosoftTeamsReply.setLoggerLevel(level);
    lib.MicrosoftTeamsAttachment.setLoggerLevel(level);
    lib.MicrosoftTeamsHostedContent.setLoggerLevel(level);
    lib.MicrosoftTeamsTaskManager.setLoggerLevel(level);
    lib.MicrosoftTeamsNotification.setLoggerLevel(level);
}


/**
 * get related msTeamsMessageInfo file according to the record
 *
 * @param {SCFile} record
 * @param {Array} fields
 * @returns {SCFile}
 */
function getMessageInfo(record, fields) {
    var fileName = funcs.filename(record);
    var key = record.getUniqueFields()[0];
    var fileId = record[key];

    var scfile;
    if (fields) {
        scfile = $("!msTeamsMessageInfo").fields(fields);
    } else {
        scfile = $("msTeamsMessageInfo");
    }

    // query active message first
    var message = scfile.find("active=true and fileName=:fileName and fileId=:fileId", fileName, fileId).one();
    if (!message) {
        // sort by sysmodtime to return the new one
        message = scfile.setOrderBy(["sysmodtime"], [SCFILE_DSC]).find("fileName=:fileName and fileId=:fileId", fileName, fileId).one();
    }

    return message;
}


/**
 * combine multiple GET requests in one HTTP call using JSON batching
 * this function is a wrapper of batch API, it returns the result in Array Object in order
 *
 * @param {Array} urls
 *          [ url ]
 * @returns {Object}
 *          {
 *              error,
 *              values: [Object]
 *          }
 */
function jsonBatchGet(intId, urls) {
    if (!urls || urls.length == 0) {
        return {
            values: []
        };
    }

    var requests = [];

    const msGraphEndPoint = lib.AzureAuthentication.API_ENDPOINT();
    var prefix = msGraphEndPoint + "/v1.0";

    var i;
    for (i = 0; i < urls.length; i++) {
        var url = urls[i];
        if (url.indexOf(prefix) == 0) {
            url = url.substring(prefix.length);
        }

        var request = {
            "id": String(i + 1),
            "method": "GET",
            "url": url
        };
        requests.push(request);
    }

    var body = JSON.stringify({
        "requests": requests
    });

    var response = API.jsonBatch(intId, body);
    var respObj = parseResponse(response);

    if (respObj.error) {
        return respObj;
    }

    var responsesObj = respObj.responses;
    if (!responsesObj || responsesObj.length == 0) {
        return {
            values: []
        };
    }

    // sort by response id
    responsesObj.sort(function(a, b) {
        return Number(a.id) - Number(b.id);
    });

    var values = [];
    responsesObj.forEach((responseObj) => values.push(responseObj.body));

    return {
        "values": values
    };
}


/**
 * get my user id
 *
 * @returns {String}
 */
function getMyId(intId) {
    var response = API.me(intId, "$select=id");
    var respObj = parseResponse(response);

    if (respObj.error) {
        return null;
    } else {
        return respObj.id;
    }
}


/**
 * get teams graph api token module
 *
 * @param {String} intId
 * @returns {String}
 */
function getTeamsTokenModule(intId) {
    // append integration id, like "teams-1" to support multiple instances
    return TOKEN_TEAMS_PREFIX + intId;
}


/**
 * get bot restful api token module
 *
 * @param {String} intId
 * @returns {String}
 */
function getBotTokenModule(intId) {
    // append integration id, like "bot-1" to support multiple instances
    return TOKEN_BOT_PREFIX + intId;
}


/**
 * check whether token module is for teams
 *
 * @param {String} module
 * @returns {Boolean}
 */
function isTokenModuleForTeams(module) {
    return module && module.startsWith(TOKEN_TEAMS_PREFIX);
}


/**
 * check whether token module is for bot
 *
 * @param {String} module
 * @returns {Boolean}
 */
function isTokenModuleForBot(module) {
    return module && module.startsWith(TOKEN_BOT_PREFIX);
}


/**
 * get integration id from the module
 *
 * @param {String} module
 * @returns {String}
 */
function getIntIdInTokenModule(module) {
    if (isTokenModuleForTeams(module)) {
        return module.substring(TOKEN_TEAMS_PREFIX.length);
    } else if (isTokenModuleForBot(module)) {
        return module.substring(TOKEN_BOT_PREFIX.length);
    }

    return "";
}


/**
 * get integration id by team id
 *
 * @param {String} teamId
 * @returns {String}
 */
function getIntIdByTeamId(teamId) {
    var team = $("!msTeamsTeamInfo").fields("intId").find("teamId=:teamId", teamId).one();
    if (!team) {
        return null;
    }

    if (team.intId) {
        return team.intId;
    }

    // return existed integration's id if not in multiple instance mode
    if (!lib.MicrosoftTeamsConfiguration.isMultiInstanceMode()) {
        var configItem = $("!SMISConfiguration").fields("intId").find("template=:template", TEMPLATE_TEAMS).one();
        if (configItem) {
            return configItem.intId;
        }
    }

    return null;
}


/**
 * get integration id by operator name
 *
 * @param {String} operatorName
 * @returns {String}
 */
function getIntIdByOperator(operatorName) {

    if (!lib.MicrosoftTeamsConfiguration.isEnabled()) {
        logger.warn(`The Microsoft Teams integration instance is disabled.`);
        return null;
    }

    // return existed integration's id if not in multiple instance mode
    if (!lib.MicrosoftTeamsConfiguration.isMultiInstanceMode()) {
        var configItem = lib.MicrosoftTeamsConfiguration.getConfigurationItem();
        return configItem.intId;
    }

    // multiple instances mode 
    var msUserId;

    var msUser = $("!msUserInfo").fields("userId").find("operatorName=:name", operatorName).one();
    if (msUser) {
        msUserId = msUser.userId;
    } else {
        msUserId = getEmailByOperator(operatorName);
    }

    if (!msUserId) {
        return null;
    }

    var intId;

    // retrieve user info
    var query = 'template="' + lib.MicrosoftTeamsConstants.TEMPLATE_TEAMS() + '" and status~="' + lib.smis_Constants.INSTANCE_STATUS_DISABLE() + '"';
    $("!SMISConfiguration").fields("intId").find(query).each(function(config) {
        if (synchronizeMsUser(config.intId, msUserId)) {
            intId = config.intId;
            return true;
        }
    });

    return intId;
}


/**
 * get integration name by team id
 *
 * @param {String} teamId
 * @returns {String}
 */
function getIntNameByTeamId(teamId) {
    var intId = getIntIdByTeamId(teamId);
    if (!intId) {
        return null;
    }

    var configItem = $("!SMISConfiguration").fields("name").find("intId=:intId", intId).one();
    if (configItem) {
        return configItem.name;
    }

    return null;
}


/**
 * upgrade team's integration id which is empty
 * this function is called during application upgrade
 *
 * @returns {Number}
 */
function upgradeEmptyTeamIntId() {
    if (lib.MicrosoftTeamsConfiguration.isMultiInstanceMode()) {
        return 0;
    }

    var count = $("!SMISConfiguration").fields("intId").count('template="' + TEMPLATE_TEAMS + '"');
    if (count != 1) {
        return 0;
    }

    var configItem = $("!SMISConfiguration").fields("intId").find("template=:template", TEMPLATE_TEAMS).one();
    var intId = configItem.intId;

    var updateCount = 0;

    $("msTeamsTeamInfo").find("null(intId)").each(function(team) {
        team.intId = intId;
        var rc = team.doUpdate();
        if (rc == RC_SUCCESS) {
            updateCount++;
        }
    });

    return updateCount;
}


/**
 * get operator by Microsoft user id
 *
 * @param {String} msUserId
 * @returns {String}
 */
function getOperatorByMsUser(msUserId) {
    if (!msUserId) {
        logger.warn("Microsoft user id is empty.");
        return null;
    }

    if (logger.isDebugEnabled()) {
        logger.debug(`Microsoft user id is "${msUserId}".`);
    }

    var operatorName = null;

    var msUser = $("!msUserInfo").fields("operatorName").find("userId=:id", msUserId).one();
    if (msUser) {
        operatorName = msUser.operatorName;
        if (logger.isDebugEnabled()) {
            logger.debug(`related operator found: "${operatorName}".`);
        }
        return operatorName;
    }

    // retrieve user info
    if (!lib.MicrosoftTeamsConfiguration.isEnabled()) {
        logger.warn(`The Microsoft Teams integration instance is disabled.`);
        return null;
    }

    var query = 'template="' + lib.MicrosoftTeamsConstants.TEMPLATE_TEAMS() + '" and status~="' + lib.smis_Constants.INSTANCE_STATUS_DISABLE() + '"';
    $("!SMISConfiguration").fields("intId").find(query).each(function(config) {
        operatorName = synchronizeMsUser(config.intId, msUserId);
        if (operatorName) {
            return true;
        }
    });

    return operatorName;
}


/**
 * get Microsoft user id by operator
 *
 * @param {String} operatorName
 * @returns {String}
 */
function getMsUserByOperator(operatorName) {
    var msUser = $("!msUserInfo").fields("userId").find("operatorName=:operator", operatorName).one();
    if (msUser) {
        return msUser.userId;
    }

    // ms user not synchronized yet, use email instead
    var email = getEmailByOperator(operatorName);
    if (!email) {
        return null;
    }

    // synchronize ms user
    var query = 'template="' + lib.MicrosoftTeamsConstants.TEMPLATE_TEAMS() + '" and status~="' + lib.smis_Constants.INSTANCE_STATUS_DISABLE() + '"';
    $("!SMISConfiguration").fields("intId").find(query).each(function(config) {
        if (synchronizeMsUser(config.intId, email)) {
            return true;
        }
    });

    // check ms user again
    msUser = $("!msUserInfo").fields("userId").find("operatorName=:operator", operatorName).one();
    if (msUser) {
        return msUser.userId;
    }

    return null;
}


/**
 * get operator name by SM user
 * the user could be either operator or contact
 *
 * @param {String} user
 * @returns {String}
 */
function getOperatorNameByUser(user) {
    if (!user) {
        return user;
    }

    // check operator
    var operator = lib.operatorUtil.getOperatorByName(user, ["name"]);
    if (operator) {
        return user;
    }

    // check contact
    return lib.operatorUtil.getOperatorNameByContactName(user);
}


/**
 * synchronize msUser by id
 *
 * @param {String} intId
 * @param {String} msUserId
 *          MS user id or email
 * @returns {String} operator name
 */
function synchronizeMsUser(intId, msUserId) {
    var response = API.user(intId, msUserId, "$select=id,displayName,userPrincipalName");
    var respObj = parseResponse(response);

    if (respObj.error) {
        logger.error(JSON.stringify(respObj.error));
        return null;
    }

    var userName = respObj.userPrincipalName;
    if (!userName) {
        logger.warn(`[${intId}]`, `related operator not found by Microsoft user id "${msUserId}".`);
        return null;
    }

    // find operator by user.principal.name, name and email
    var operator = $("!operator").fields("name").find("user.principal.name=:name", userName).one();
    if (!operator) {
        operator = $("!operator").fields("name").find("name=:name", userName).one();
        if (!operator) {
            operator = $("!operator").fields("name").find("email=:email", userName).one();
        }
    }

    if (!operator) {
        // try find contact by email
        var contact = $("!contacts").fields("operator.id").find("email=:email", userName).one();
        if (contact) {
            operator = $("!operator").fields("name").find("name=:name", contact.operator_id).one();
        }
    }

    if (!operator) {
        logger.warn(`[${intId}]`, `related operator not found by Microsoft user "${userName}".`);
        return null;
    }

    msUserId = respObj.id;
    var operatorName = operator.name;

    var msUser = $("msUserInfo").find("userId=:id", msUserId).one();
    // create user
    if (!msUser) {
        msUser = new SCFile("msUserInfo");
        msUser.userId = msUserId;
        msUser.displayName = respObj.displayName;
        msUser.operatorName = operatorName;

        if (msUser.doInsert() == RC_SUCCESS) {
            logger.info(`msUser "${operatorName}" created.`);
            return operatorName;
        }
    }
    // update user
    else {
        if (msUser.displayName != respObj.displayName || msUser.operatorName != operatorName) {
            msUser.displayName = respObj.displayName;
            msUser.operatorName = operatorName;
            if (msUser.doUpdate() == RC_SUCCESS) {
                logger.info(`msUser "${operatorName}" updated.`);
                return operatorName;
            }
        } else {
            return operatorName;
        }
    }

    return null;
}


/**
 * get email by operator name
 *
 * @param {String} operatorName
 * @returns {String}
 */
function getEmailByOperator(operatorName) {
    if (!operatorName) {
        return null;
    }

    if (lib.MailUtil.isEmailAddress(operatorName)) {
        return operatorName;
    }

    // check operator email
    var operator = $("!operator").fields("email").find("name=:name", operatorName).one();
    if (operator && operator.email) {
        return operator.email;
    }

    // check contact email
    var contact = $("!contacts").fields("email").find("operator.id=:name", operatorName).one();
    if (contact) {
        return contact.email;
    }

    return null;
}


/**
 * validate SMIS parameters
 *
 * @param {SCFile} configItem
 * @param {Array} mandatoryList
 * @returns {String}
 */
function validateSMISParams(configItem, mandatoryList) {
    return lib.smis_CommonLib.validateSMISParams(configItem, mandatoryList, "msteams");
}