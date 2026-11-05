function enableSecurity() {
    var manager = lib.ConfigurationUpgradeManager.getInstance();
    var ret = new SCDatum();
    var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", ret, 1);
    lib.upgradeLog.detail("Upgrade Profiles...");
    manager.upgradeProfiles();
    funcs.rtecall("trigger", ret, 0);
    lib.upgradeLog.detail("Upgrade Operators...");
    manager.upgradeOperators();
    funcs.rtecall("trigger", ret, triggerStatus);
    lib.upgradeLog.detail("Upgrade User Roles...");
    manager.upgradeUserRoles();
}