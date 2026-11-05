function getType() {
    return lib.FeatureSettings.getGlobalSettings().type;
}

function isGit() {
    return 'git' == getType();
}

function isSvn() {
    return 'svn' == getType();
}

function run() {
    return getLib().run();
}

function getLib() {
    if (isGit()) {
        return lib.DevOpsBase4Git;
    }

    return lib.DevOpsBase4Svn;
}

function getTypeName() {
    return getType() == 'git' ? 'GIT' : 'Subversion';
}

function selectNew() {
    getLib().selectNew();
}

function selectConflict() {
    getLib().selectConflict();
}

function getLastVersionInfo(version) {
    return getLib().getLastVersionInfo(version);
}

function printStack() {
    getLog('DevOpsBase').info(lib.debugUtils.getStackTrace());
}

function commitList(list, id, msg) {
    return getLib().commitList(list, id, msg);
}

function canCommit() {
    return system.functions.index("FeatureTrackerCommit", vars.$lo_ucapex) > 0;
}