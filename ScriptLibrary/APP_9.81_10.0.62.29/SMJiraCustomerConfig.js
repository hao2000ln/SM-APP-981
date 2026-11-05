var jiraUtil = lib.SMJiraUtil;
/**
* Update the conditions for automatic synchronization of Change
* vars.$jiraProject: The integration instance ID
* vars.$jiraAction: The type of the Jira issue
* Example: If the assignmentGroup of the Change is "Application", 
 *          The current Change record will be synchronized to Jira's SC project as a New Feature
*/
function changeAutoSync(file) {
    var assignmentGroup = file["assign.dept"];
    var projects = jiraUtil.getAllEnabledInstance(funcs.filename(file));
    var isEnable = isInstanceEnable(projects);
    if (isEnable && assignmentGroup == "Application") {
        vars.$jiraProject = projects[0];
        vars.$jiraAction = "New Feature";
    }
}

/**
* Update the conditions for automatic synchronization of Incident
* vars.$jiraProject: The integration instance ID
* vars.$jiraAction: The type of the Jira issue
* Example: If the assignment of the incident is "Application", 
 *          The current Incident record will be synchronized to Jira's SMBT project as a Bug.
*/
function incidentAutoSync(file) {
    var assignment = file["assignment"];
    var projects = jiraUtil.getAllEnabledInstance(funcs.filename(file));
    var isEnable = isInstanceEnable(projects);
    if (isEnable && assignment == "Application") {
        vars.$jiraProject = projects[0];
        vars.$jiraAction = "Bug";
    }
}

/**
* Update the Jira issue types that the Change/Incident module can support.
* vars.$jiraActions: The types of the jira issue, including Bug, New Feature, and Improvement
* vars.$jiraActionsDisPlay: The value displayed in the Jira Action field in SM
*/
function supportJiraTypes(module) {
    if (module == "cm3r") {
        vars.$jiraActions = ["New Feature"];
        vars.$jiraActionsDisplay = ["Change To New Feature"];
    } else if (module == "probsummary") {
        vars.$jiraActions = ["Bug"];
        vars.$jiraActionsDisPlay = ["Incident To Bug"];
    }
}


function isInstanceEnable(projects){
    return projects && projects.length > 0;
}