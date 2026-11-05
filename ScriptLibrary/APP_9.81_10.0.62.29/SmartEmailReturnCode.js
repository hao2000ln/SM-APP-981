var rc = {
    SUCCESS: "200",
    PROCESSED: "201",
    CONNECTION_FAILURE: "404",
    SERVER_ERROR: "500",
    INVALID_DOMAIN: "501",
    AUTO_REPLY: "502",
    INVALID_OPERATOR: "503",
    NOT_AUTHORIZED: "504",
    ACTION_ERROR: "505",
    EXCEED_SIZE_LIMITATION: "506",
    TOKEN_EXPIRED: "507",
    TOKEN_DECRYPT_FAILED: "508",
    TOKEN_BEEN_USED: "509",
    TOKEN_USURPED: "510",
    RECORD_NOT_FOUND: "511",
    SMIS_TASK_EXPIRED: "513",
    VALIDATION_ERROR: "514",
    EMPTY_COMMENT: "515",
    EMPTY_EMAIL: "516",
    UNSUPPORT_EMAIL: "517"
}

var needRecoveredTaskCodes = [rc.CONNECTION_FAILURE, rc.SERVER_ERROR, rc.VALIDATION_ERROR];

var ignoredTaskCodes = [rc.EMPTY_COMMENT, rc.EMPTY_EMAIL, rc.AUTO_REPLY, rc.UNSUPPORT_EMAIL];

var retryTaskCodes = [rc.CONNECTION_FAILURE, rc.SERVER_ERROR];

var processedCodes = [rc.SUCCESS, rc.PROCESSED, rc.NOT_AUTHORIZED, rc.EXCEED_SIZE_LIMITATION];

function getReturnCode() {
    return rc;
}

function isProcessRetryReturnCode(processStatusCode){
    return lib.ArrayUtil.indexOf(retryTaskCodes, processStatusCode) != -1;
}

function isHandleProcessedReturnCode(processStatusCode){
    return lib.ArrayUtil.indexOf(processedCodes, processStatusCode) != -1;
}

function isIgnoredReturnCode(processStatusCode){
    return lib.ArrayUtil.indexOf(ignoredTaskCodes, processStatusCode) != -1;
}

function ifNeedRecoveredReturnCode(processStatusCode){
    return lib.ArrayUtil.indexOf(needRecoveredTaskCodes, processStatusCode) != -1;
}