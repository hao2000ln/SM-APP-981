/**
 * If some changes need to Sync to ALM automatically
 * Update the condition and return {action, workspace}.
 */
function getAlmConfig(file) {
    var fileName = funcs.filename(file);
    if ('cm3r' == fileName) return getAlmConfigForChange(file);
    if ('rootcause' == fileName) return getAlmConfigForProblem(file);
    return null;
}

function getAlmConfigForChange(change) {
    // The condition for Change To Defect, a default one is to contain CI 'CI1000910, adv-Server-101_tomcat'
    let list = change.assets && change.assets.toArray() || [];
    if (isChangeToDefectEnabled() && list.includes('CI1000910')) {
        let workspace = vars.$G_alm_WS_LIST_CHANGE_TO_DEFECT[0];
        if (workspace) {
            return {
                action: 'changeToDefect',
                workspace
            }
        }
    }

    // The condition for Change To Requirement, a default one is to contain CI 'CI1000914, adv-Server-102_tomcat'
    if (isChangeToFeatureEnabled() && list.includes('CI1000914')) {
        let workspace = vars.$G_alm_WS_LIST_CHANGE_TO_FEATURE[0];
        if (workspace) {
            return {
                action: 'changeToFeature',
                workspace
            }
        }
    }

    return null;
}

function getAlmConfigForProblem(problem) {
    // The condition for Problem To Defect, a default one is to contain CI 'CI1000910, adv-Server-101_tomcat'
    if (isProblemToDefectEnabled() && problem.logical_name == 'CI1000910') {
        let workspace = vars['$G.alm.WS.LIST.PROBLEM.TO.DEFECT'][0];
        if (workspace) {
            return ({
                action: 'problemToDefect',
                workspace
            })
        }
    }

    return null;
}


function isEnabled(name) {
    var list = vars[name];
    return list && list.length() > 0;
}

function isChangeToDefectEnabled() {
    return isEnabled('$G.alm.WS.LIST.CHANGE.TO.DEFECT');
}

function isChangeToFeatureEnabled() {
    return isEnabled('$G.alm.WS.LIST.CHANGE.TO.FEATURE');
}

function isProblemToDefectEnabled() {
    return isEnabled('$G.alm.WS.LIST.PROBLEM.TO.DEFECT');
}