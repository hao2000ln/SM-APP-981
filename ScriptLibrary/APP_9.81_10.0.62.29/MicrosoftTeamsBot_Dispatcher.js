var $ = lib.c.$;
var logger = getLog("MicrosoftTeamsBot_Dispatcher");
var API = lib.MicrosoftGraphAPI;

var setExitType = lib.BaseUtil.setExitType;
var setErrorMsg = lib.BaseUtil.setErrorMsg;

// return code
const NORMAL_EXIT = lib.BaseUtil_Constants.NORMAL_EXIT();
const ERROR_EXIT = lib.BaseUtil_Constants.ERROR_EXIT();
const NO_RECORD_EXIT = lib.BaseUtil_Constants.NO_RECORD_EXIT();
const BAD_VALIDATION_EXIT = lib.BaseUtil_Constants.BAD_VALIDATION_EXIT();
const NO_AUTH = lib.BaseUtil_Constants.NO_AUTH();
const CURRENTRECORD_LOCKED = lib.BaseUtil_Constants.CURRENTRECORD_LOCKED();
const CURRENTRECORD_CHANGED = lib.BaseUtil_Constants.CURRENTRECORD_CHANGED();
const INVALID_ACTION = lib.BaseUtil_Constants.INVALID_ACTION();

const RETURN_CODE_MAP = {
    "true": NORMAL_EXIT,
    RC_SUCCESS: NORMAL_EXIT,
    "false": ERROR_EXIT,
    RC_ERROR: ERROR_EXIT,
    RC_CANT_HAVE: CURRENTRECORD_LOCKED,
    RC_MODIFIED: CURRENTRECORD_CHANGED,
    "70": INVALID_ACTION,
    RC_NOT_AUTHORIZED: NO_AUTH,
    RC_VALIDATION_FAILED: BAD_VALIDATION_EXIT
};

const NO_RECORDS_MSG = funcs.scmsg("9", "object");


/**
 * set log level
 *
 * @param {String} level
 */
function setLoggerLevel(level) {
    logger.setLevel(level);
    API.setLoggerLevel(level);
}


/**
 * main entry for teams bot web service
 */
function doAction() {

    // setLoggerLevel("debug");

    if (logger.isDebugEnabled()) {
        logger.debug("start do action.");
        logger.debug("$L.file: " + lib.debugUtils.display(vars.$L_file));
    }

    evalExpressions();

    setExitType(NORMAL_EXIT);

    // get action
    var apiName = populateCurrentAPIName();
    if (logger.isDebugEnabled()) {
        logger.debug(`action is "${apiName}".`);
    }

    switch (apiName) {
        case "createmsteamsinteraction":
            return createInteraction(vars.$L_file);
        case "findmsteamsincident":
            return findIncident(vars.$L_file);
        case "createmsteamsincident":
            return createIncident(vars.$L_file);
        case "updatemsteamsincident":
            return updateIncident(vars.$L_file);
        case "resolvemsteamsincident":
            return resolveIncident(vars.$L_file);
        case "closemsteamsincident":
            return closeIncident(vars.$L_file);
        default:
            logger.warn(`action "${apiName}" is not supported.`);
            setExitType(INVALID_ACTION);
    }
}


/**
 * evaluate extaccess expressions
 */
function evalExpressions() {
    var expressions = vars.$L_extaccess_file.expressions;

    if (expressions) {
        if (logger.isDebugEnabled()) {
            logger.debug("evaluate extaccess expressions.");
            logger.debug(expressions);
        }

        var i;
        var length = expressions.length();
        for (i = 0; i < length; i++) {
            if (expressions[i]) {
                funcs.evaluate(expressions[i]);
            }
        }
    }
}


/**
 * get webservice action
 */
function populateCurrentAPIName() {
    var objName = vars.$L_object;
    var actionName = vars.$L_extaccess_file.action_names[vars.$L_2lower_index - 1];

    return String(actionName + objName).toLowerCase();
}


/**
 * create interaction
 *
 * @param {SCFile} interaction
 */
function createInteraction(interaction) {
    logger.info("start create interaction.");

    var msUserId = interaction.opened_by;
    var operatorName = lib.MicrosoftTeamsUtil.getOperatorByMsUser(msUserId);

    if (!operatorName) {
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("488", "us", [msUserId]));
        return;
    }

    var securityIssue = operatorSecurityIssue(operatorName);
    if (securityIssue) {
        setExitType(NO_AUTH);
        setErrorMsg(securityIssue);
        return;
    }

    // check permission
    if (!lib.SecurityIntegration.hasRight(operatorName, interaction, "new")) {
        logger.warn(`operator ${operatorName} not have permission to create interaction.`);
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("5", "doceng", [operatorName, "create"]));
        return;
    }

    interaction.opened_by = operatorName;

    if (!interaction.callback_contact) {
        var contactName = lib.operatorUtil.getContactNameByOperatorName(operatorName);
        if (contactName) {
            interaction.callback_contact = contactName;
        }
    }

    // set default folder
    if (vars.$G_folderEntitlement && !interaction.folder) {
        interaction.folder = getOperatorDefaultFolder(operatorName);
    }

    setOperator(operatorName);

    var rc = interaction.doAction("add");

    var exitType = getExitTypeByReturnCode(rc);
    setExitType(exitType);
}


/**
 * find incident
 *
 * @param {SCFile} incident
 */
function findIncident(incident) {

    var number = incident.number;

    logger.info(`start find incident "${number}".`);

    if (!number) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(NO_RECORDS_MSG);
        return;
    }

    /*
     * RESTful GET not able to check permission on specific user
     * call find() before RESTful GET to check the user permission 
     */

    var msUserId = incident.updated_by;
    var operatorName = lib.MicrosoftTeamsUtil.getOperatorByMsUser(msUserId);

    if (!operatorName) {
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("488", "us", [msUserId]));
        return;
    }

    var securityIssue = operatorSecurityIssue(operatorName);
    if (securityIssue) {
        setExitType(NO_AUTH);
        setErrorMsg(securityIssue);
        return;
    }

    incident = $("probsummary").find("number=:number", number).one();

    // check view permission
    if (!lib.SecurityIntegration.hasRight(operatorName, incident, "view")) {
        logger.warn(`operator ${operatorName} not have permission to view incident ${number}.`);
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("5", "doceng", [operatorName, "view"]));
        return;
    }

    setExitType(NORMAL_EXIT);
}


/**
 * create incident
 *
 * @param {SCFile} incident
 */
function createIncident(incident) {
    logger.info("start create incident.");

    var msUserId = incident.opened_by;
    var operatorName = lib.MicrosoftTeamsUtil.getOperatorByMsUser(msUserId);

    if (!operatorName) {
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("488", "us", [msUserId]));
        return;
    }

    var securityIssue = operatorSecurityIssue(operatorName);
    if (securityIssue) {
        setExitType(NO_AUTH);
        setErrorMsg(securityIssue);
        return;
    }

    // check permission
    if (!lib.SecurityIntegration.hasRight(operatorName, incident, "new")) {
        logger.warn(`operator ${operatorName} not have permission to create incident.`);
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("5", "doceng", [operatorName, "create"]));
        return;
    }

    incident.opened_by = operatorName;

    // set default folder
    if (vars.$G_folderEntitlement && !incident.folder) {
        incident.folder = getOperatorDefaultFolder(operatorName);
    }

    setOperator(operatorName);

    var rc = incident.doAction("add");

    var exitType = getExitTypeByReturnCode(rc);
    setExitType(exitType);
}


/**
 * update incident
 *
 * @param {SCFile} incident
 */
function updateIncident(incident) {

    var number = incident.number;

    logger.info(`start update incident "${number}".`);

    if (!number) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(NO_RECORDS_MSG);
        return;
    }

    var msUserId = incident.updated_by;
    var operatorName = lib.MicrosoftTeamsUtil.getOperatorByMsUser(msUserId);

    if (!operatorName) {
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("488", "us", [msUserId]));
        return;
    }

    var securityIssue = operatorSecurityIssue(operatorName);
    if (securityIssue) {
        setExitType(NO_AUTH);
        setErrorMsg(securityIssue);
        return;
    }

    var oldIncident = $("probsummary").find("number=:number", number).one();

    // already closed
    if (oldIncident.flag == false) {
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("504", "pm"));
        return;
    }

    // check permission
    if (!lib.SecurityIntegration.hasRight(operatorName, oldIncident, "update")) {
        logger.warn(`operator ${operatorName} not have permission to update incident ${number}.`);
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("5", "doceng", [operatorName, "update"]));
        return;
    }

    // check whether incident changed besides field "updated.by" which set in request
    incident.updated_by = oldIncident.updated_by;
    if (funcs.same(oldIncident, incident)) {
        logger.info(`there is no change for incident ${number}, ignore update.`);
        setExitType(NORMAL_EXIT);
        setErrorMsg(funcs.scmsg("6", "object", [funcs.scmsg("probsummary", "tablename")]));
        return;
    }

    incident.updated_by = operatorName;

    setOperator(operatorName);

    var rc = incident.doAction("save");

    var exitType = getExitTypeByReturnCode(rc);
    setExitType(exitType);
}


/**
 * resolve incident
 *
 * @param {SCFile} incident
 */
function resolveIncident(incident) {

    var number = incident.number;

    logger.info(`start resolve incident "${number}".`);

    if (!number) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(NO_RECORDS_MSG);
        return;
    }

    var msUserId = incident.updated_by;
    var operatorName = lib.MicrosoftTeamsUtil.getOperatorByMsUser(msUserId);

    if (!operatorName) {
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("488", "us", [msUserId]));
        return;
    }

    var securityIssue = operatorSecurityIssue(operatorName);
    if (securityIssue) {
        setExitType(NO_AUTH);
        setErrorMsg(securityIssue);
        return;
    }

    var oldIncident = $("probsummary").find("number=:number", number).one();

    // already resolved or closed
    if (oldIncident.problem_status == "Resolved" || oldIncident.flag == false) {
        // normal exit to align with current SOAP behavior
        setExitType(NORMAL_EXIT);
        // setExitType(BAD_VALIDATION_EXIT);
        setErrorMsg(funcs.scmsg("503", "pm"));
        return;
    }

    // check permission
    if (!lib.SecurityIntegration.hasRight(operatorName, oldIncident, "update")) {
        logger.warn(`operator ${operatorName} not have permission to resolve incident ${number}.`);
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("5", "doceng", [operatorName, "resolve"]));
        return;
    }

    incident.updated_by = operatorName;

    setOperator(operatorName);

    incident.problem_status = "Resolved";

    var rc = incident.doAction("save");

    var exitType = getExitTypeByReturnCode(rc);
    setExitType(exitType);
}


/**
 * close incident
 *
 * @param {SCFile} incident
 */
function closeIncident(incident) {

    var number = incident.number;

    logger.info(`start close incident "${number}".`);

    if (!number) {
        setExitType(NO_RECORD_EXIT);
        setErrorMsg(NO_RECORDS_MSG);
        return;
    }

    var msUserId = incident.closed_by;
    var operatorName = lib.MicrosoftTeamsUtil.getOperatorByMsUser(msUserId);

    if (!operatorName) {
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("488", "us", [msUserId]));
        return;
    }

    var securityIssue = operatorSecurityIssue(operatorName);
    if (securityIssue) {
        setExitType(NO_AUTH);
        setErrorMsg(securityIssue);
        return;
    }

    var oldIncident = $("probsummary").find("number=:number", number).one();

    // already closed
    if (oldIncident.flag == false) {
        // normal exit to align with current SOAP behavior
        setExitType(NORMAL_EXIT);
        setErrorMsg(funcs.scmsg("502", "pm"));
        return;
    }

    // check permission
    if (!lib.SecurityIntegration.hasRight(operatorName, oldIncident, "delete")) {
        logger.warn(`operator ${operatorName} not have permission to close incident ${number}.`);
        setExitType(NO_AUTH);
        setErrorMsg(funcs.scmsg("5", "doceng", [operatorName, "close"]));
        return;
    }

    incident.closed_by = operatorName;

    setOperator(operatorName);

    // var rc = incident.doAction("close");
    var rc = incident.doAction("_wfE:close.any.time");

    var exitType = getExitTypeByReturnCode(rc);
    setExitType(exitType);
}


/**
 * check operator security issue
 *
 * @param {String} opName
 * @returns {String} 
 *          issue message if has security issue
 *          null if no security issue found
 */
function operatorSecurityIssue(opName) {
    var operator = $("!operator").fields(["login.revoked", "ess.access.only"]).find("name=:name", opName).one();

    // operator has been locked out
    if (operator.login_revoked) {
        return funcs.scmsg("58", "scbase");
    }

    // no need to check whether password expired

    // ess opearator not allowed
    if (operator.ess_access_only) {
        return funcs.scmsg("1", "ess");
    }

    return null;
}


/**
 * set current operator
 *
 * @param {String} opName
 */
function setOperator(opName) {
    lib.SecurityIntegration.setOperator(opName);
}


/**
 * get operator default folder
 *
 * @param {String} opName
 * @returns {String} default folder
 */
function getOperatorDefaultFolder(opName) {
    var operator = $("!operator").fields("defaultFolder").find("name=:name", opName).one();
    return operator.defaultFolder;
}


/**
 * get exit type by return code
 *
 * @param {Number} returnCode
 * @returns {String}
 * @see rad se.external.action::exit.normal
 */
function getExitTypeByReturnCode(returnCode) {
    var exitType = RETURN_CODE_MAP[returnCode];
    if (!exitType) {
        logger.warn(`return code "${returnCode}" is unknown.`);
        exitType = BAD_VALIDATION_EXIT;
    }

    return exitType;
}