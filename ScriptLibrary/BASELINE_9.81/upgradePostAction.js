function executePostActionUpdate(upgradestatus) {
    lib.upgradeCommonHelper.fixSystemData();

    // update special scmessages
    lib.upgradeCommonHelper.updateScMessages();

    // deprecate legacy content pack information
    lib.upgradeCommonHelper.deprecateLegacyContentPack();

    lib.upgradeMaldatasPurge.compileDisplayScreen();

    enableRelationManager(upgradestatus.option);

    // expire globallists
    lib.upgradeLog.detail(funcs.scmsg(419, "upg"));
    lib.upgradeCommonHelper.expireGlobalLists();
    lib.upgradeLog.detail(funcs.scmsg(420, "upg"));

    // print post upgrade prompt message
    var msg = lib.upgradeCommonHelper.getPostUpgradePromptMessage();
    if (msg.length > 0) {
        lib.upgradeLog.detail(msg);
        print(msg);
    }
}


function enableRelationManager(option) {
    lib.upgradeLog.upgrade("Enable Relation.");
    lib.upgradeLog.detail("Enable Relation.");
    var err = new SCDatum();
    funcs.rtecall("trigger", err, 1);
    funcs.rtecall("counter", err, 1);
    if (option == "unconditional") {
        lib.RelationManagerEnablement.enableRelationManager();
    } else {
        lib.c.$("#referenceService").buildRelations();
    }
    funcs.rtecall("counter", err, 0);
    funcs.rtecall("trigger", err, 0);
}