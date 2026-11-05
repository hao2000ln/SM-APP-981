var logger = getLog("jira.JiraIncidentModule");
var $ = lib.c.$;
var jiraUtil = lib.SMJiraUtil;
var jiraService = lib.SMJiraService;

function setLoggerLevel(level) {
    logger.setLevel(level);
}

function displayJiraInfo(incident) {
    jiraService.displayJiraInfo(incident);
}

//Auto Sync Incident To Jira
function autoSyncIncidentToJira(incident) {
    var projects = jiraUtil.getAllEnabledInstance("probsummary");
    if (projects.includes(vars.$jiraProject)) {
        jiraService.syncSMRecordToJira(incident);
    }
}

//Auto sync condition
function checkSyncCondition(file) {
    if (!jiraUtil.isJiraEnable(file)) {
        return false;
    } else if (!jiraUtil.hasEndPointInfo()) {
        return false;
    } else if (jiraUtil.customerIncidentConfig(file)) {
        return true;
    }
    return false;
}

//if "View Jira Info" button is visible
function isViewJiraVisible(incident) {
    var isInstanceEnable = jiraUtil.isJiraEnable(incident);
    if (!isInstanceEnable) {
        return false;
    } else {
        var jiraUrl = jiraUtil.getJiraBrowseUrl(incident['number']);
        if (jiraUrl) {
            return true;
        }
    }
    return false;
}

function isAlreadySynced(number) {
    var jiraInfo = $('!JiraInfo').fields(['id', 'smKey']).find('smKey="' + number + '"').one();
    if (jiraInfo) {
        return true;
    } else {
        return false;
    }
}

/* sync incident activity to jira comments */
function syncNewCommentToJira(activity) {
    var smTable = "probsummary";
    var result = jiraService.addCommentToInfoMore(smTable, activity);
    if(result){
        jiraUtil.recordDebugLogs(logger, 'The incident activity ' + activity['thenumber'] + 'will be synced to Jira');
    }
}