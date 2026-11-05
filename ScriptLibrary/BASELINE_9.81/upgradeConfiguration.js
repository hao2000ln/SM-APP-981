/**
 * Get upgrade configuration
 *
 * @returns {SCFile}
 */
function getConfiguration() {
	var config = new SCFile("upgradeconfiguration");
	var query = "name=\"Upgrade\"";
	var rc = config.doSelect(query);
	
	if (rc == RC_SUCCESS) {
		return config;
	}
	else {
		print(system.functions.scmsg(12, "error", ["upgradeconfiguration", query]));
		return null;
	}
}


/**
 * Get file list those support field level merge
 *
 * @returns {Array}
 */
function getSupportFieldMergeFiles() {
	var config = getConfiguration();
	if (config == null || config.fieldmerge_files == null) {
		return [];
	}
	
	return lib.ArrayUtil.toJsArray(config.fieldmerge_files);
}

function recordUpgradeDbdictList() {
    var upgradedbdict = lib.upgradeUtility.getRecord("dbdict", "name=\"upgradedbdict\"");
    if (upgradedbdict == null) {
        return;
    }
    
    var upgconfig = lib.upgradeUtility.getRecord("upgradeconfiguration", "true");
    if (upgconfig == null) {
        return;
    }
    
    var dbdictlist = [];
    
    var upgdbdict = new SCFile("upgradedbdict");
    var rc = upgdbdict.doSelect("true");
    while (rc == RC_SUCCESS) {
        dbdictlist.push(upgdbdict["name"]);
        rc = upgdbdict.getNext();
    }
    
    if (dbdictlist.length > 0) {
        upgconfig["dbdict.list"] = dbdictlist;
        upgconfig.doUpdate();
    }
}

function getUpgradeDbdictList() {   
    var upgconfig = getConfiguration();
    if (upgconfig == null) {
        return [];
    }
    
    return system.functions.denull(upgconfig["dbdict.list"]);
}

function isUpgradeDbdict(dbdict) {
    var dbdictlist = getUpgradeDbdictList();
    
    if (lib.ArrayUtil.length(dbdictlist) == 0) {
        return true;
    }
    
    return lib.ArrayUtil.contains(dbdictlist, dbdict);
}

function isReplaceScriptLibrary() {
    var upgconfig = getConfiguration();
    if (upgconfig != null) {
        return system.functions.nullsub(upgconfig["replace.scriptlibrary"], true);
    }
    
    return true;
}

function getScriptLibrarySkipList() {
    var upgconfig = getConfiguration();
    if (upgconfig != null) {
        return system.functions.denull(upgconfig["scriptlibrary.skip.list"]);
    }
    return [];
}

function addScriptLibrary2SkipList(slName) {
    var upgconfig = getConfiguration();
    if (upgconfig != null) {
        if (slName != null && !lib.ArrayUtil.contains(upgconfig["scriptlibrary.skip.list"], slName)) {
            upgconfig["scriptlibrary.skip.list"] = system.functions.insert(upgconfig["scriptlibrary.skip.list"], 0, 1, slName);
            upgconfig.doUpdate();
        }
    }
}

function isFilterUnchanged() {
    var upgconfig = getConfiguration();
    if (upgconfig != null) {
        return system.functions.nullsub(upgconfig["options"]["filter.unchanged"], false);
    }
    
    return false;
}

function isFixDuplicateKey() {
    var upgconfig = getConfiguration();
    if (upgconfig != null) {
        return system.functions.nullsub(upgconfig["options"]["fix.duplicate.key"], false);
    }
    
    return false;
}
