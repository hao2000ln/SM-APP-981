// predef globals for JSLINT sm
const predefs_jslint = [
    // global system objects
    "funcs",
    "lib",
    "system",
    "vars",

    // global methods
    "appCounter",
    "base64Decode",
    "base64Encode",
    "beginThread",
    "callrad",
    "checkAttachmentLegal",
    "collectSystemStatus",
    "compile",
    "compress",
    "compressImage",
    "CRC32",
    "createUserList",
    "deleteFile",
    "doHTTPRequest",
    "doIDOLRequest",
    "doSOAPRequest",
    "execute",
    "forceGC",
    "getLastRC",
    "getLog",
    "getLwssoToken",
    "getRecordKey",
    "getRTEParm",
    "getSimpleCacheValue",
    "getSystemCacheValue",
    "getUserList",
    "getUserMessages",
    "HandleReportExportTask",
    "HandleReportExportTask2",
    "help",
    "insertDatum",
    "Lock",
    "makeDir",
    "makeSCWebURL",
    "parseQuery",
    "print",
    "Quit",
    "RCtoString",
    "readFile",
    "removeSystemCache",
    "rteBuildSecRoleRights",
    "rteJSONParse",
    "rteJSONStringify",
    "searchUserList",
    "setAppMessage",
    "setDisableLdap",
    "setSimpleCacheValue",
    "setSystemCacheValue",
    "startProfile",
    "stopProfile",
    "stripHtml",
    "sysExec",
    "uncompressFile",
    "unescapeName",
    "uncompress",
    "Unlock",
    "writeAttachmentToFile",
    "writeFile",
    "xmlstring",

    // defined objects
    "Attachment",
    "Datum",
    "Header",
    "HttpURLConnection",
    "SCDatum",
    "SCFile",
    "SCRecordList",
    "Script",
    "Query",
    "QueryCond",
    "XML",
    "XMLDate",

    // defined query operator
    "EQ",
    "LIKE",
    "NEQ",
    "GT",
    "GE",
    "LT",
    "LE",
    "ISIN",

    // defined constants
    "RC_SUCCESS",
    "RC_ERROR",
    "RC_NO_MORE",
    "RC_CANT_HAVE",
    "RC_DUPLICATE_KEY",
    "RC_MODIFIED",
    "RC_DELETED",
    "RC_BAD_QUERY",
    "RC_NOT_AUTHORIZED",
    "RC_VALIDATION_FAILED",
    "RC_UNABLE_TO_WRITE_TO_FILE",
    "RC_UNABLE_TO_CLOSE_FILE",
    "RC_UNABLE_TO_DELETE_FILE",
    "SCFILE_ASC",
    "SCFILE_DSC",
    "SCFILE_READONLY"
];

// RC_ERROR (-1) : Some other error occurred. Examine the contents of the Messages view or the sm.log file for more information.
// RC_SUCCESS (0) : The operation succeeded.
// RC_CANT_HAVE (3) : The operation failed because the resource is unavailable because some other user or process has the resource locked.
// RC_NO_MORE (9) : No more records are available in the result set.
// RC_DUPLICATE_KEY (48) : The insert operation failed because the file already contains a record with this unique key value.
// RC_MODIFIED (51) : The update operation failed because the record was modified by another user or process since you read it.
// RC_DELETED (52) : The operation failed because the record was deleted by another user or process.
// RC_BAD_QUERY (66) : The query failed due to incorrect query syntax.
// RC_NOT_AUTHORIZED (28) : The request operation was not performed due to an authorization failure. Check the permissions associated with the user who submitted the request.
// RC_VALIDATION_FAILED (71) : The operation failed because the data supplied in a field or record did not pass validity checks performed by the application.
// RC_UNABLE_TO_WRITE_TO_FILE (20) : The operation failed. Check to make sure the file name is correct, that the file exists, and that it is not read-only.
// RC_UNABLE_TO_CLOSE_FILE (47) : The operation failed. Check to make sure the file name is correct, that the file exists, and that it is not read-only.
// RC_UNABLE_TO_DELETE_FILE (57) : The operation failed. Check to make sure the file name is correct, that the file exists, and that it is not read-only.