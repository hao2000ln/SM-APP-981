var $ = lib.c.$;
/**
 * Script to update Configuration module to PD style
 * TODO upgradeOperator and upgradeUserRoles can be refect and reuse in other module
 **/
var ConfigurationUpgradeManager = $(lib.ProcessDesignCPUpgradeManager.getClass(),
    new function() {

        return {
            upgradeCategories: function() {},

            upgradeProfiles: function() {
                var profile = new SCFile("icmenv", SCFILE_READONLY);
                profile.setFields("name");
                var sql = "true";
                var upgradeInfoObj = {};
                upgradeInfoObj["dbdict_profile_930"] = ["add", "allow.partial", "allowedStatus", "append.query", "auditor", "change.devtype", "confirm.on.end", "count.recs", "db.complex", "db.mass.update", "db.template", "delete", "export", "expressions", "fill", "find", "inbox.edit", "inbox.search", "initial.format", "list.edit", "mass.add", "mass.delete", "name", "new", "open.problem", "print", "query.window", "request.change", "require.password", "search.format", "search.list", "skip.warning", "sysmodcount", "sysmodtime", "sysmoduser", "type", "update", "view", "views"];
                upgradeInfoObj["mapped_fields"] = ["allowedStatus", "mass.delete", "allow.partial", "skip.warning", "search.format", "inbox.search", "search.list", "list.edit", "inbox.edit", "type", "change.devtype", "open.problem", "request.change", "require.password", "confirm.on.end", "auditor"];
                upgradeInfoObj["profile_dbdict_name"] = "icmenv";
                upgradeInfoObj["script_setup_name"] = "SecuritySetupEnvironment";
                upgradeInfoObj["areas"] = ["Configuration Item"];

                if (profile.doSelect(sql) == RC_SUCCESS) {
                    do {
                        //using the new role upgrade script	
                        lib.SecurityProfileCopy.upgradeProfiles(profile.name, upgradeInfoObj);
                    }
                    while (profile.getNext() == RC_SUCCESS);
                }
            },

            upgradeAreas: function() {
                var datadict = new SCFile("datadict");
                var sql = 'name isin {"device","activitydevice"}';

                if (datadict.doSelect(sql) == RC_SUCCESS) {
                    do {
                        datadict.sc_area = "Configuration Item";
                        datadict.doUpdate();
                    }
                    while (datadict.getNext() == RC_SUCCESS);
                }
            }
        };
    });

function getClass() {
    return ConfigurationUpgradeManager;
}

function getInstance() {
    return new ConfigurationUpgradeManager("device", "Configuration Item", "profile.inventory");
}