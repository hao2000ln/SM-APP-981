/**
 * Pre process before conversion of upgrade
 */
function preConvert() {

    lib.upgradeLog.detail("Refresh Data.");
    refreshData();

    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    if (fromVersion.indexOf("9.3") == 0 || fromVersion.indexOf("9.4") == 0) {
        var upgradestatus = lib.upgradeUtility.getUpgradeStatus();
        var fromIndex = lib.upgradeVersionUtil.getVersionIndex(fromVersion);

        if (fromIndex == lib.upgradeVersionUtil.getVersionIndex("9.41.0020 PD")) {
            if (upgradestatus != null && upgradestatus["option"] == "rename") {
                lib.upgradePDMigration.recoverHybridCategory();
            }
        }

        if (lib.FolderMigrate != null && lib.FolderMigrate.migrateLegacySecurityModelFolders != null) {
            lib.upgradeLog.detail("Migrating Legacy Security Folders...");
            lib.FolderMigrate.migrateLegacySecurityModelFolders();
            lib.upgradeLog.detail("Finish Migrating Legacy Security Folders.");
        } else {
            lib.upgradeLog.detail("Fail to Migrate Legacy Security Folders.");
        }
    }
}


/**
 * Post process in the last step of upgrade
 */
function postConvert(version) {

    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    var fromIndex = lib.upgradeVersionUtil.getVersionIndex(fromVersion);
    if (fromIndex < 0) {
        return;
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.60.0025")) {
        // refresh scFolderAccess records
        if (vars.$G_folderEntitlement) {
            var ret = new SCDatum();
            var triggerStatus = funcs.sysinfo_get("trigger");
            // enable trigger
            funcs.rtecall("trigger", ret, 1);
            lib.upgradeLog.detail("Refreshing Folder Rights...");
            lib.folderFunctions.refreshAllFolderRights();
            lib.upgradeLog.detail("Finish Refreshing Folder Rights.");
            funcs.rtecall("trigger", ret, triggerStatus);
        }
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.61.0019")) {
        lib.upgradeCommonHelper.updateInboxLocalization();
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.62.0016")) {
        lib.upgradeCm3r.removeRMPhases();
    }

    if (fromIndex <= lib.upgradeVersionUtil.getVersionIndex("9.70.0024")) {
        // delete legacy chat configuration
        lib.EndUserChatConfiguration.deleteLegacyConfigurations();
        // upgrade catalog connector localization
        lib.upgradeCommonHelper.updateSvcCatInterfaceLocalization();
        // update teams integration
        lib.MicrosoftTeamsUtil.upgradeEmptyTeamIntId();
    }

    if (fromIndex <= lib.upgradeVersionUtil.getVersionIndex("9.71.0008")) {
        // migrate UCMDB configuration for gateway and other legacy configuration before SM95
        lib.upgradeLog.detail("Migrate legacy UCMDB configuration.");
        lib.uCMDBConfiguration.migrateUCMDBConfiguration();
    }

    if (fromIndex <= lib.upgradeVersionUtil.getVersionIndex("9.72.0025")) {
        // cleanup legacy propel content
        lib.upgradeLog.detail("Cleanup legacy propel content.");
        lib.CleanUpPropelContent.cleanup();
    }
    
    removeSettingsConfig();

    updateDatadictDurationFields();

    updateSchedules(true);
}


function convertSM93(runForOld) {
    if (runForOld == null) {
        runForOld = false;
    }

    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    if (!runForOld && fromVersion.indexOf("9.3") < 0) {
        return;
    }

    var fromIndex = lib.upgradeVersionUtil.getVersionIndex(fromVersion);
    if (fromIndex < 0) {
        return;
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.32.0016")) {
        lib.svcCatalogMix.mix();
        lib.upgradeAssetManager.run();
        lib.folderFunctions.updateFolderAccessNoViewRights();
        lib.svcCatalogUpdateAllSvcItemCounts.updateAllsvcItemCounts();
        lib.ScAPI_Tailoring_Configuration.initSrcTailoringConfiguration();
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.34.0032")) {
        var ret = new SCDatum();
        funcs.rtecall("counter", ret, 1);
        lib.timeperiodOccurrence.createTimePeriodOccurrenceSchedule();
        funcs.rtecall("counter", ret, 0);
    }

    if (fromIndex <= lib.upgradeVersionUtil.getVersionIndex("9.34.0032")) {
        lib.svcCatUpdateUserOptions.setAllMandatoryOptions();
    }
}


/**
 * Post action when upgrade from SM94x versions.
 */
function convertSM94(runForOld) {
    if (runForOld == null) {
        runForOld = false;
    }

    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    if (!runForOld && fromVersion.indexOf("9.4") < 0) {
        return;
    }

    var fromIndex = lib.upgradeVersionUtil.getVersionIndex(fromVersion);
    if (fromIndex < 0) {
        return;
    }

    var pdVersion = lib.upgradeVersionUtil.getPdVersion();
    if (fromVersion.indexOf("9.4") == 0 && pdVersion == "") {
        fixPdData();
    }

    var ret = new SCDatum();

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.40.0015")) {

        // update kmquery dbdict
        lib.upgradeLog.detail("Update dbdict kmquery.");
        funcs.rtecall("counter", ret, 1);
        lib.KMknowledgebase.rebuildKmqueryDbdict();
        funcs.rtecall("counter", ret, 0);

        fixInfoData();

        fixActivityservicemgt();

        // Fix data for Calendar
        lib.upgradeLog.detail("Fix data for Calendar.");
        lib.CalendarDao.removeOldEmbeddedCalendarConfiguration();
        lib.CalendarDao.removeEnablementFromCalendarSettings();

        lib.RuleWizard.popupAllRuleType();

        lib.upgradeLog.detail("Enabling security for SLM module.");
        funcs.rtecall("counter", ret, 1);
        lib.processDesignerSLMUpgrade.upgradeSecurity();
        funcs.rtecall("counter", ret, 0);

        funcs.rtecall("trigger", ret, 0);

        lib.upgradeLanguage.fixLanguagesPost();
    }

    // update idol, must execute before add key for dept and svcDisplay
    lib.upgradeLog.upgrade("Update IDOL.");
    lib.upgradeLog.detail("Update IDOL.");
    funcs.rtecall("counter", ret, 1);
    lib.idolUpgrade.upgrade();
    funcs.rtecall("counter", ret, 0);

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.41.0020")) {
        // remove abandoned inbox
        lib.InboxHelper.removeAbandonedInboxRecords();

        // cleanup legacy UCMDB web service data
        lib.DisplayName.cleanUpUCMDBIntegrationWebService();

        lib.upgradeKeyChanges.addKey({
            "table": "dept",
            "keyType": 8,
            "columns": ["seq.id"]
        });
        lib.upgradeKeyChanges.addKey({
            "table": "svcDisplay",
            "keyType": 8,
            "columns": ["displayId"]
        });

        // update CI displayName
        lib.upgradeLog.upgrade("Update CI display name.");
        lib.upgradeLog.detail("Update CI display name.");
        lib.DisplayName.batchUpdateCIDisplayNameByLogicalName();
        lib.upgradeKeyChanges.updateKey({
            "table": "device",
            "keyType": 0,
            "columns": ["network.name", "logical.name"],
            "updateTo": ["network.name", "display.name"]
        });
        lib.upgradeKeyChanges.addKey({
            "table": "device",
            "keyType": 4,
            "columns": ["display.name"]
        });
    }
}

/**
 * Post action when upgrade from SM95x versions.
 */
function convertSM95(runForOld) {
    if (runForOld == null) {
        runForOld = false;
    }

    var fromVersion = lib.upgradeVersionUtil.getUpgradeFromVersion();
    if (!runForOld && fromVersion.indexOf("9.5") < 0) {
        return;
    }

    var fromIndex = lib.upgradeVersionUtil.getVersionIndex(fromVersion);
    if (fromIndex < 0) {
        return;
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.50.0025")) {
        fixRenameRecords();

        updateModuleStatus();

        updateSlacontrol();

        if (lib.SurveyUpgrade != null && lib.SurveyUpgrade.doUpgrade != null) {
            lib.upgradeLog.detail("Update Survey Functionality.");
            lib.SurveyUpgrade.doUpgrade();
        }

        lib.upgradeLog.detail("Complete fullname of OOFlowConfigurationItem.");
        lib.SMOOFlowConfigurationItem.complementOOFCIFullName();

        lib.upgradeLog.detail("Update mail number of Mail records.");
        lib.MailUtil.upgradeMailno();
        lib.upgradeKeyChanges.addKey({
            "table": "mail",
            "keyType": 28,
            "columns": ["mailno"]
        });
    }

    if (fromIndex < lib.upgradeVersionUtil.getVersionIndex("9.52.0011")) {
        lib.upgradeLog.detail("Clean legacy configuration item module data.");
        lib.upgradeCommonHelper.cleanLegacyConfigurationItemModule();

        lib.upgradeLog.detail("Enable Configuration Security...");
        var ret = new SCDatum();
        funcs.rtecall("counter", ret, 1);
        lib.ProcessDesignerConfigurationEnableManager.enableSecurity();
        funcs.rtecall("counter", ret, 0);
        lib.upgradeLog.detail("Enable Configuration Security finished.");
    }
}


function fixInfoData() {
    lib.upgradeLog.upgrade("Fix info data.");
    lib.upgradeLog.detail("Fix info data.");
    var info = lib.upgradeUtility.getRecord("info", "type=\"company\"");
    if (info != null) {
        if (info.nativeCCM != true) {
            info.nativeCCM = true;
            info.doUpdate();
        }
    }
}

function updateSlacontrol() {
    lib.upgradeLog.upgrade("Update slacontrol.");
    lib.upgradeLog.detail("Update slacontrol.");

    var slacontrol = lib.upgradeUtility.getRecord("slacontrol", "unique.key=1");
    if (slacontrol != null) {
        var update = false;
        if (slacontrol.effective_condition == null || funcs.lng(slacontrol.effective_condition) == 0) {
            update = true;
            slacontrol.effective_condition = funcs.parse("current.phase in $L.file=\"agreed\"", 11);
        } else {
            if (funcs.type(slacontrol.effective_condition) != 10) {
                update = true;
                slacontrol.effective_condition = funcs.parse(slacontrol.effective_condition, 11);
            }
        }

        if (slacontrol.group_table == null || funcs.lng(slacontrol.group_table) == 0) {
            update = true;
            slacontrol.group_table = "assignment";
        }

        if (update) {
            slacontrol.doUpdate();
        }
    }
}

function updateSlaControlEffectiveCondition() {
    lib.upgradeLog.upgrade("Update slacontrol effective condition.");
    lib.upgradeLog.detail("Update slacontroleffective condition.");

    var slacontrol = lib.upgradeUtility.getRecord("slacontrol", "unique.key=1");
    if (slacontrol != null) {
        if (slacontrol.effective_condition != null && funcs.lng(slacontrol.effective_condition) > 0) {
            if (funcs.type(slacontrol.effective_condition) != 10) {
                slacontrol.effective_condition = funcs.parse(slacontrol.effective_condition, 11);
                slacontrol.doUpdate();
            }
        }
    }
}

function updateSchedules(ignoreVersion) {
    lib.upgradeLog.upgrade("Add/Update schedules.");
    lib.upgradeLog.detail("Add/Update schedules.");
    if (ignoreVersion == null) {
        ignoreVersion = false;
    }

    var verArr = lib.upgradeConstants.FULL_VERSIONS();
    var targetVer = lib.upgradeConstants.TARGET_VERSION();
    var SM940 = funcs.index("9.40.0015", verArr);
    var SM941 = funcs.index("9.41.0020", verArr);
    var SM950 = funcs.index("9.50.0025", verArr);
    var SM951 = funcs.index("9.51.0015", verArr);
    var SM960 = funcs.index("9.60.0025", verArr);
    var LATEST = funcs.index(targetVer, verArr);

    addRefCheckToSchedule();

    var scheduleObjs = [{
            "version": SM940,
            "schedules": {
                "adds": [{
                    name: "Background Reorder Scheduler",
                    schedule_id: 2600685,
                    _class: "ocm",
                    sched_class: "ocm",
                    description: "",
                    repeat: "00 23:59:59",
                    javascript: "lib.ReorderService.reOrder(\"\");"
                }],
                "updates": [{
                    name: "KMUpdate",
                    javascript: "lib.IDOL_Utilities.scheduleKMUpdate();"
                }]
            }
        },
        {
            "version": SM941,
            "schedules": {
                "adds": [{
                        name: "AutomationTaskUpdate",
                        schedule_id: 2600565,
                        _class: "AutomationTaskUpdate",
                        sched_class: "AutomationTaskUpdate",
                        description: "Manages the Automation Task executed in OO",
                        repeat: "00 00:05:00",
                        javascript: "lib.SMOOAutomationTaskService.refreshOOFlowStatus();"
                    },
                    {
                        name: "background purge/archive TodoAlertList",
                        schedule_id: 2700006,
                        _class: "report",
                        sched_class: "report",
                        description: "",
                        repeat: "1 00:00:00",
                        application: "pa.main.appl.bg",
                        strings: [
                            "TodoAlertList",
                            "TodoAlertList",
                            "record.update.time<tod()-'14 00:00:00'",
                            "",
                            "purge",
                            "append",
                            "create",
                            "update",
                            "",
                            "false",
                            "winnt",
                            "",
                            "",
                            "",
                            "",
                            "false"
                        ]
                    },
                    {
                        name: "KMAttachment",
                        schedule_id: 2554587,
                        _class: "KMAttachment",
                        sched_class: "KMAttachment",
                        description: "",
                        repeat: "00 00:05:00",
                        javascript: "lib.IDOL_Utilities.scheduleKMAttachment();"
                    },
                    {
                        name: "KMAttachmentStatus",
                        schedule_id: 2554588,
                        _class: "KMAttachment",
                        sched_class: "KMAttachment",
                        description: "",
                        repeat: "00 00:05:00",
                        javascript: "lib.IDOL_Utilities.scheduleKMAttachmentStatus();"
                    },
                    {
                        name: "Process Time Duration Reporting Data",
                        schedule_id: 2700005,
                        _class: "timedurationdata",
                        sched_class: "timedurationdata",
                        description: "",
                        repeat: "00 00:05:00",
                        javascript: "lib.timeDurationEtl.doWork();"
                    }
                ],
                "updates": []
            }
        },
        {
            "version": SM950,
            "schedules": {
                "adds": [{
                        name: "background SmartEmail processor",
                        schedule_id: 1300001,
                        _class: "SmartEmail_Processor",
                        sched_class: "SmartEmail_Processor",
                        description: "background SmartEmail processor",
                        repeat: "00 00:00:05",
                        javascript: "lib.SmartEmailController.processSmartEmail();"
                    },
                    {
                        name: "background purge/archive emailarchiving",
                        schedule_id: 1195941,
                        _class: "report",
                        sched_class: "report",
                        description: "",
                        repeat: "1 00:00:00",
                        application: "pa.main.appl.bg",
                        strings: [
                            "emailarchivingstore",
                            "emailarchivingstore",
                            "",
                            "",
                            "purge",
                            "append",
                            "create",
                            "update",
                            "",
                            "false",
                            "winnt",
                            "",
                            "",
                            "",
                            "",
                            "false"
                        ],
                        strings1: [
                            "",
                            "",
                            "jscall(\"EmailArchivingUtil.buildPurgeQuery\")"
                        ]
                    },
                    {
                        name: "background purge smartemailewsstore",
                        schedule_id: 1195942,
                        _class: "report",
                        sched_class: "report",
                        description: "",
                        repeat: "1 00:00:00",
                        application: "pa.main.appl.bg",
                        strings: [
                            "smartemailewsstore",
                            "smartemailewsstore",
                            "",
                            "",
                            "purge",
                            "append",
                            "create",
                            "update",
                            "",
                            "false",
                            "winnt",
                            "",
                            "",
                            "",
                            "",
                            "false"
                        ],
                        strings1: [
                            "",
                            "",
                            "jscall(\"SmartEmailUtil.buildPurgeSmartEmailMsgIdQuery\")"
                        ]
                    },
                    {
                        name: "background purge smartemailimapstore",
                        schedule_id: 1195943,
                        _class: "report",
                        sched_class: "report",
                        description: "",
                        repeat: "1 00:00:00",
                        application: "pa.main.appl.bg",
                        strings: [
                            "smartemailimapstore",
                            "smartemailimapstore",
                            "",
                            "",
                            "purge",
                            "append",
                            "create",
                            "update",
                            "",
                            "false",
                            "winnt",
                            "",
                            "",
                            "",
                            "",
                            "false"
                        ],
                        strings1: [
                            "",
                            "",
                            "jscall(\"SmartEmailUtil.buildPurgeSmartEmailMsgIdQuery\")"
                        ]
                    },
                    {
                        name: "background purge smartemailpop3store",
                        schedule_id: 1195944,
                        _class: "report",
                        sched_class: "report",
                        description: "",
                        repeat: "1 00:00:00",
                        application: "pa.main.appl.bg",
                        strings: [
                            "smartemailpop3store",
                            "smartemailpop3store",
                            "",
                            "",
                            "purge",
                            "append",
                            "create",
                            "update",
                            "",
                            "false",
                            "winnt",
                            "",
                            "",
                            "",
                            "",
                            "false"
                        ],
                        strings1: [
                            "",
                            "",
                            "jscall(\"SmartEmailUtil.buildPurgeSmartEmailMsgIdQuery\")"
                        ]
                    },
                    {
                        name: "KMUpdate",
                        schedule_id: 2554586,
                        _class: "KMUpdate",
                        sched_class: "KMUpdate",
                        description: "",
                        repeat: "00 00:05:00",
                        javascript: "lib.IDOL_Utilities.scheduleKMUpdate();"
                    },
                    {
                        name: "License Usage Report",
                        schedule_id: 1000001,
                        _class: "scheduledAction",
                        sched_class: "scheduledAction",
                        description: "Report SM license usage to Usage Hub.",
                        repeat: "00 00:30:00",
                        javascript: "lib.usageReport.reportUsage();"
                    },
                    {
                        name: "ppmfailover",
                        schedule_id: 1310001,
                        _class: "ppmfailover",
                        sched_class: "ppmfailover",
                        description: "",
                        repeat: "00 01:00:00",
                        javascript: "lib.HPPPMSMIntegration.ppmFailover();;"
                    }
                ],
                "updates": []
            }
        },
        {
            "version": SM951,
            "schedules": {
                "adds": [{
                    name: "KM Reindex Manual Retry Monitor",
                    schedule_id: 2700007,
                    _class: "KMReindex",
                    sched_class: "KMReindex",
                    description: "",
                    repeat: "00:00:05",
                    javascript: "lib.IDOLKMReindexSample.transferFailedToIncr();\nlib.IDOLKMReindexSample.monitorOphanSchedule();"
                }],
                "updates": []
            }
        },
        {
            "version": SM960,
            "schedules": {
                "adds": [],
                "updates": []
            }
        },
        {
            "version": LATEST,
            "schedules": {
                "adds": [{
                        name: "Monitor Counter and Number",
                        schedule_id: 2800001,
                        _class: "scheduledAction",
                        sched_class: "scheduledAction",
                        description: "Check and report when the record of Counter and Number has reached close to the upper limit.",
                        repeat: "1 00:00:00",
                        javascript: "var toUsers = [\"falcon\"];\n\nlib.CounterMonitor.checkCounterWarning(toUsers);"
                    },
                    {
                        name: "Residual Email Attachments Clean",
                        schedule_id: 2800002,
                        _class: "scheduledAction",
                        sched_class: "scheduledAction",
                        description: "Clean residual attachment from SYSATTACHMENTS when the relevant email is sent and eventout is removed.",
                        repeat: "1 00:00:00",
                        javascript: "lib.SmartEmailUtil.removeEmailAttachments();"
                    },
                    {
                        name: "Configuration Item Relation BSG Processor",
                        schedule_id: 2800003,
                        _class: "configuration",
                        sched_class: "configuration",
                        description: "Process the configuration item relationship in background.",
                        repeat: "00:05:00",
                        javascript: "lib.BSGRelationsCalculation.beginProcessTask();"
                    },
                    {
                        name: "PortalNotification_Cleanup",
                        schedule_id: 2029038,
                        _class: "portalnotification",
                        sched_class: "portalnotification",
                        repeat: "1 00:00:00",
                        javascript: "lib.PortalNotification.cleanUpOldNotifications();"
                    },
                    {
                        name: "snapshot license",
                        schedule_id: 2900001,
                        _class: "scorecard",
                        sched_class: "scorecard",
                        repeat: "01:00:00",
                        javascript: "lib.ScorecardAsyncUpdate.snapshotLicense();"
                    },
                    {
                        name: "snapshot servlet",
                        schedule_id: 2900002,
                        _class: "scorecard",
                        sched_class: "scorecard",
                        repeat: "01:00:00",
                        javascript: "lib.ScorecardAsyncUpdate.snapshotServlet();"
                    },
                    {
                        name: "snapshot user information",
                        schedule_id: 2900003,
                        _class: "scorecard",
                        sched_class: "scorecard",
                        repeat: "00:30:00",
                        javascript: "lib.ScorecardAsyncUpdate.snapshotUserInfo();"
                    }
                ],
                "updates": [{
                    name: "Configuration Item Relation BSG Processor",
                    javascript: "lib.BSGRelationsCalculation.beginProcessTask();"
                }],
                "removes": [{
                    name: "License Usage Report"
                }]
            }
        }
    ];

    var i;
    for (i = 0; i < scheduleObjs.length; i++) {
        if (ignoreVersion || scheduleObjs[i].version > vars.$G_tmpUpgFrmVerSeq) {
            lib.upgradeCommonHelper.createSchedules(scheduleObjs[i]["schedules"]);
        }
    }
}

function addRefCheckToSchedule() {
    lib.upgradeLog.detail("Add schedule \"Reference missing check report scheduler\".");

    var file = new SCFile("schedule");
    var actiionTime = new Date();
    var expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 1);

    var duration = new XMLDate("P00DT00H01M00S");

    file["name"] = "Reference missing check report scheduler";
    var err = new SCDatum();
    var schedule = lib.upgradeUtility.getRecord("schedule", "schedule.id=2600600");
    if (schedule == null) {
        file["schedule.id"] = 2600600;
    } else {
        funcs.rtecall("counter", err, 1);
    }
    file["class"] = "refcheck";
    file["expiration"] = expiration;
    file["sched.class"] = "refcheck";
    file["action.time"] = actiionTime;
    file["repeat"] = duration.getDatum();
    file["repeatm"] = false;
    file["repeatq"] = false;
    file["repeatb"] = false;
    file["repeata"] = false;

    file["description"][0] = "This scheduler is used to generate the reference missing report for those big tables/long running scans.";
    file["description"][1] = "Most of the time, it should be triggerred doing nothing, but as long as there is a task put into the reference missing check queue,";
    file["description"][2] = "the scheduler should call the Javascript to execute the reference missing check process.";

    file["javascript"] = "lib.refCheckScheduler.refCheckScheduler();";

    file.doSave();
    file.doClose();

    funcs.rtecall("counter", err, 0);
}

var renameList = [{
        "table": "migrationSetting",
        "field": "name",
        "values": ["Legacy known error to problem",
            "Legacy known error attachment to problem attachment",
            "Legacy Quote to new Request",
            "Legacy Quote Line Item to new RequestTask",
            "Legacy Order to new Request",
            "Legacy Order Line Item to new RequestTask",
            "Legacy attachment to new attachment for new Request Module",
            "Legacy Approval to new Approval for new Request",
            "Legacy ApprovalLog to new ApprovalLog for new Request Module"
        ],
        "prefix": "Deleted-"
    },
    {
        "table": "Object",
        "field": "file.name",
        "values": ["activityservicemgt"],
        "prefix": "Obsoleted-"
    }
];

function fixRenameRecords() {
    var i;
    var j;
    for (i = 0; i < renameList.length; i++) {
        var table = renameList[i].table;
        var field = renameList[i].field;
        var prefix = renameList[i].prefix;
        var values = renameList[i].values;
        lib.upgradeLog.detail("Rename the records of " + table);
        for (j = 0; j < values.length; j++) {
            var file = lib.upgradeUtility.getRecord(table, field + "=\"" + values[j] + "\"");
            if (file != null) {
                file[field] = prefix + values[j];
                var renamedFile = lib.upgradeUtility.getRecord(table, field + "=\"" + file[field] + "\"");
                if (renamedFile != null) {
                    renamedFile.doDelete();
                }
                lib.upgradeLog.detail("Renamed " + table + " " + values[j]);
                file.doUpdate();
            }
        }
    }
}

function fixActivityservicemgt() {
    lib.upgradeLog.detail("Fix datadict activityservicemgt.");

    var tableName = "activityservicemgt";
    var datadictRecord = new SCFile("datadict");
    var datadictSql = "name=\"" + tableName + "\"";
    if (datadictRecord.doSelect(datadictSql) === RC_SUCCESS) {
        datadictRecord['sc.area'] = "";
        datadictRecord.doUpdate();
    }
}

function updateDatadictDurationFields() {
    lib.upgradeLog.detail("Update datadict duration fields.");
    var datadictName = "rootcause";
    var fieldNames = ["expected.resolution.time", "rootcauseDate", "solutionDate"];

    var datadict = new SCFile("datadict");
    var rc = datadict.doSelect("name=\"" + datadictName + "\"");
    if (rc === RC_SUCCESS) {
        var fields = datadict["fields"];
        var lng = lib.ArrayUtil.length(fields);
        var i;
        var found = false;
        for (i = 0; i < lng; i++) {
            if (fieldNames.includes(fields[i]) && datadict["fieldUsage"][i] == "duration") {
                datadict["fieldUsage"][i] = null;
                found = true;
            }
        }

        if (found) {
            lib.upgradeLog.detail("Update datadict " + datadictName + " duration fields " + fieldNames);
            datadict.doUpdate();
        }
    }
}

function fixPdData() {
    lib.upgradeLog.upgrade("Fix Process Designer data.");
    lib.upgradeLog.detail("Fix Process Designer data.");

    var pdVersion = lib.upgradeVersionUtil.getPdVersion();

    lib.upgradeLog.detail("Fix datadict of Helpdesk.");
    lib.ProcessDesignHelpDeskEnableManager.enableDatadicts();

    lib.upgradeLog.detail("Fix datadict of Change.");
    lib.ProcessDesignerChangeEnableManager.enableDatadict();
    lib.ProcessDesignerChangeEnableManager.enableCMCategoryForm();

    lib.upgradeLog.detail("Fix product catalog link of Request.");
    lib.ProcessDesignerRequestEnableManager.enableProductCatalogLink();

    var ret = new SCDatum();
    var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", ret, 0);
    lib.upgradeLog.detail("Fix assignment of Request.");
    lib.ProcessDesignerRequestEnableManager.enableAssignment();
    funcs.rtecall("trigger", ret, triggerStatus);

    lib.upgradeLog.detail("Fix security of Request.");
    funcs.rtecall("counter", ret, 1);
    lib.ProcessDesignerRequestEnableManager.enableSecurity();
    funcs.rtecall("counter", ret, 0);

    lib.upgradeLog.detail("Fix schedule of Request.");
    lib.ProcessDesignerRequestEnableManager.enableSchedules();

    lib.upgradeLog.detail("Update upgraderesults for Process Designer.");
    lib.upgradeMerging.handleResult4PD();

    if (pdVersion == "PDCP4") {
        fixSdCategory();
    } else if (pdVersion == "PDCP3" || pdVersion == "") {
        lib.upgradeLog.detail("Enable Help Desk Security...");
        funcs.rtecall("counter", ret, 1);
        lib.ProcessDesignHelpDeskEnableManager.enableSecurity();
        funcs.rtecall("counter", ret, 0);
        lib.upgradeLog.detail("Enable Help Desk Security finished.");
        if (pdVersion == "") {
            lib.upgradeLog.detail("Enable Change Security...");
            funcs.rtecall("counter", ret, 1);
            lib.ProcessDesignerChangeEnableManager.enableSecurity();
            funcs.rtecall("counter", ret, 0);
            lib.upgradeLog.detail("Enable Change Security finished.");
        }
        if (vars["$G.role"] == null) {
            var operator = new SCFile("operator", SCFILE_READONLY);
            operator.setFields("secRole");
            var rc = operator.doSelect("name=\"" + vars["$lo.operator"]["name"] + "\"");
            if (rc == RC_SUCCESS) {
                vars["$G.role"] = operator["secRole"];
            }
        }
        lib.upgradePDMigration.executePdMigration(pdVersion);
    }
}

// Only invoke this function for PD4
function fixSdCategory() {
    lib.upgradeLog.detail("Fix sdCategory.");
    var category = lib.upgradeUtility.getRecord("sdCategory", "name=\"request for administration\"");
    if (category != null && category["escalate.type"] != "request") {
        category["escalate.type"] = "request";
        category.doUpdate();
    }

    category = lib.upgradeUtility.getRecord("sdCategory", "name=\"request for information\"");
    if (category != null && category["escalate.type"] != "request") {
        category["escalate.type"] = "request";
        category.doUpdate();
    }
}


/**
 * Refresh Data
 */
function refreshData() {
    // refresh ScriptLibrary
    var sls = ["DataService", "DbdictService", "DisplayName", "RelationManagerDbdictService", "security", "SecuritySetupEnvironment", "settings", "Workflow", "WorkflowTriggers"];

    var i;
    for (i = 0; i < sls.length; i++) {
        refreshSlData(sls[i]);
    }
}


function refreshSlData(name) {
    var query = "name~#\"upgrade\"";
    if (name != null) {
        query = "name=\"" + name + "\"";
    }
    // refresh special ScriptLibrary which will cause error 
    var fScript = new SCFile("ScriptLibrary");
    var rc = fScript.doSelect(query);

    if (rc == RC_SUCCESS && fScript.sysmodcount == 0) {
        // update to increase sysmodcount
        fScript.doUpdate();
        lib.upgradeLog.detail(funcs.scmsg(201, "object", ["ScriptLibrary", name]));
    }
}

function updateModuleStatus() {
    lib.upgradeLog.detail("Update ModuleStatus.");

    var ENABLE_MODULES = ["probsummary", "incidents", "rootcause", "rootcausetask", "imTask", "request", "requestTask", "requesttask", "svcCatalog"];

    var moduleStatus = new SCFile("ModuleStatus");
    var query = '';

    var i;
    for (i = 0; i < ENABLE_MODULES.length; i++) {
        query = 'null(conditionDesc) and module="' + ENABLE_MODULES[i] + '"';

        if (moduleStatus.doSelect(query) == RC_SUCCESS) {
            do {
                moduleStatus.is_bkgstatus = true;
                moduleStatus.doUpdate();

                var rc = moduleStatus.getNext();
            } while (rc == RC_SUCCESS);
        }
    }
}

function removeSettingsConfig() {
    lib.upgradeLog.detail("Removing settingsConfig.");
    var settings_config = [{
                               "setting": "Collaboration",
                               "id": "enableLyncUser"
                           }];
                           
    var ret = new SCDatum();
    var triggerStatus = funcs.sysinfo_get("trigger");
    funcs.rtecall("trigger", ret, 1);
    
    var rc;
    var settingsConfig = new SCFile("settingsConfig");
    var i;
    for (i=0; i<settings_config.length; i++) {
        lib.upgradeLog.detail("Removing settingsConfig "  + settings_config[i]["setting"] + " : " + settings_config[i]["id"]);
        rc = settingsConfig.doSelect("setting=\"" + settings_config[i]["setting"] + "\" and id=\"" + settings_config[i]["id"] + "\"");
        if (rc == RC_SUCCESS) {
            // remove the settingsConfig record and also remove its related records by trigger.
            settingsConfig.doDelete();
        }
    }
    
    funcs.rtecall("trigger", ret, triggerStatus);
    
    lib.upgradeLog.detail("Removing settingsConfig finished.");
}
