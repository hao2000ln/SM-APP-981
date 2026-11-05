function getReturnCode() {
    return {
        'no auth': 28,
        'badval': 71,
        'no.record': 9,
        'success': 0,
        'invalid.action': 70,
        'no.attachment': 998,
        'error': -1
    };
}

function getMaxCount() {
    return 1000;
}

function getHttpStatus() {
    var httpStatus = {};
    var returnCode = getReturnCode();
    httpStatus[returnCode['no auth']] = 403;
    httpStatus[returnCode['badval']] = 400;
    httpStatus[returnCode['no.record']] = 404;
    httpStatus[returnCode['invalid.action']] = 400;
    httpStatus[returnCode['no.attachment']] = 404;
    httpStatus[returnCode['success']] = 200;
    httpStatus[returnCode['error']] = 500;
    httpStatus['other'] = 400;
    
    return httpStatus;
}