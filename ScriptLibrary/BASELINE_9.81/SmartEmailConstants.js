// object: interaction or incident
function OBJECT_INTERACTION() { return 1; }

function OBJECT_INCIDENT() { return 2; }

function EMAIL_AGENT_NAME() { return "Email Agent"; }

function MAX_ATTACHMENT_FILENAME() { return 60; }

var map = {
    'incidents': { 'statusField': 'open', 'resolvedValue': 'Resolved' },
    'probsummary': { 'statusField': 'problem.status', 'resolvedValue': 'Resolved' },
    'rootcause': { 'statusField': 'rcStatus', 'resolvedValue': 'Resolved' },
    'request': { 'statusField': 'status', 'resolvedValue': 'Fulfilled' },
    'cm3r': { 'statusField': 'active', 'closedValue': false },
    'cm3t': { 'statusField': 'active', 'closedValue': false }
};

function StatusField() {
    return map;
}


function isResolved(scfile) {
    var filename = funcs.filename(scfile);
    var mapItem = map[filename];
    return mapItem != null && scfile[mapItem['statusField']] === mapItem['resolvedValue'];
}

function isClosed(scfile) {
    var filename = funcs.filename(scfile);
    var mapItem = map[filename];
    return mapItem != null && scfile[mapItem['statusField']] === mapItem['closedValue'];
}

function SMARTEMAIL_PREPROCESS() { return 0; }

function SMARTEMAIL_PROCESS() { return 1; }

function SMARTEMAIL_POSTPROCESS() { return 2; }

function SMARTEMAIL_MSGID_INQUE() { return 1; }

function SMARTEMAIL_MSGID_NOT_INQUE() { return 0; }

function getSmartEmailFailureProgress(code) {
    var progress = ["preProcess", "process", "postProcess"];
    return progress[code];
}


function ACTION_REFRESH_REFRESHTOKEN() {
    return "SmartEmail Refresh refreshToken";
}