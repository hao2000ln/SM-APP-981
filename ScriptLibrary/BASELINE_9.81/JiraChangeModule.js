var logger = getLog("jira.JiraChangeModule");
var $ = lib.c.$;
var jiraUtil = lib.SMJiraUtil;
var jiraService = lib.SMJiraService;

function setLoggerLevel(level) {
    logger.setLevel(level);
}

function displayJiraInfo(change) {
    jiraService.displayJiraInfo(change);
}

function autoSyncChangeToJira(change) {
    var projects = jiraUtil.getAllEnabledInstance("cm3r");
    if (projects.includes(vars.$jiraProject)) {
        jiraService.syncSMRecordToJira(change);
    }
}

function checkSyncCondition(change) {
    if (!jiraUtil.isJiraEnable(change)) {
        return false;
    } else if (!jiraUtil.hasEndPointInfo()) {
        return false;
    } else if (jiraUtil.customerChangeConfig(change)) {
        return true;
    }
    return false;
}

//if "View Jira Info" button is visible
function isViewJiraVisible(change) {
    var isInstanceEnable = jiraUtil.isJiraEnable(change);
    if (!isInstanceEnable) {
        return false;
    } else {
        var jiraUrl = jiraUtil.getJiraBrowseUrl(change['number']);
        if (jiraUrl) {
            return true;
        }
    }
    return false;
}

function isAlreadySynced(number) {
    var jiraInfo = $('!JiraInfo').fields(['id', 'smKey']).find('smTable="cm3r" and smKey="' + number + '"').one();
    if (jiraInfo) {
        return true;
    } else {
        return false;
    }
}

/* sync change activity to jira comments */
function syncNewCommentToJira(activitycm3r) {
    var smTable = "cm3r";
    var result = jiraService.addCommentToInfoMore(smTable, activitycm3r);
    if (result) {
        jiraUtil.recordDebugLogs(logger, 'The change activity ' + activitycm3r['thenumber'] + 'will be synced to Jira');
    }
}