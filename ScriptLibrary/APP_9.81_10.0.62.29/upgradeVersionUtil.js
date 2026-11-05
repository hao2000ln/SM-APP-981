/**
 * To get the current application version
 *
 */
function getCurrentVersion() {
    var scversion = getSCVersion();
    var pdVersion = getPdVersion(scversion);
    if (pdVersion == "") {
        return scversion;
    }
    
    return scversion + " " + pdVersion;
}

function getSCVersion() {
	var scversionFile = getRecord("scversion", "true");
	if(scversionFile != null && scversionFile.application_version != null) {
		return parseVersion(scversionFile.application_version);
	}
	else {
		return "Unknown";
	}
}

function getPdVersion(scversion) {
	if (scversion == null) {
	    scversion = getSCVersion();
	}
	
	// 9.3x
	if (scversion != null && scversion.indexOf("9.3") == 0) {
	    var pdversion="";
	    
	    var dbdict=getRecord("dbdict", "name=\"contentversion\"");
	    if (dbdict == null) { 
	        return "";
	    }
	    var pdversionFile = getRecord("contentversion", "module=\"Process_Designer\"");
	    
	    if(pdversionFile != null && pdversionFile.version != null) {
	        switch (pdversionFile.version) {
	            case "9.30.1":
	                 pdversion="PDCP2";
	                 break;
	            case "9.30.2":
	                 pdversion="PDCP3";
	                 break;
	            case "9.30.3":
	                 pdversion="PDCP4";
	                 break;
	        }
	    }
	    return pdversion;
	}
	
	// 9.50 or higher
	if (scversion != null && (getVersionIndex(scversion) >= getVersionIndex("9.50.0025") || +getFullMajorMinorVersion(scversion) >= 9.50)) {
	    return "";
	}
	
	return lib.ProcessDesignerEnablement.isPDEnabled() ? "PD" : "";
}


/**
 * To get the version the upgrade from
 *
 */
function getUpgradeFromVersion()
{
	var version;	
	var statusFile = getRecord("upgradestatus", "true");	
	if(statusFile != null && statusFile.current_version != null)
	{		
		version = statusFile.current_version;
	}else
	{
		var historyFile = getRecord("upgradehistory", "new.version=\"" + lib.upgradeConstants.TARGET_VERSION() + "\"");
		if(historyFile != null && historyFile.old_version != null)
		{
			version = historyFile.old_version;
		}		
	}
	if(version != null)
	{
		return parseVersion(version);	
	}else
	{
		return getCurrentVersion();
	}				
}	

// return the prefix for renaming old record
// Used by PD hybrid migration
function getOldPrefix(version, option) {
    var pre_prefix = "PRE";
    var old_prefix = "OLD";
    
    if (version == null) {
        var upgradestatus = lib.upgradeUtility.getUpgradeStatus(); 
        if(upgradestatus != null){
            version = upgradestatus['current.version'];
        }else {
            return "";
        }
    }
    
    version = version.replace(" ", "_");

    if (option == "unconditional") {
        return old_prefix + version;
    }
        
    return pre_prefix + version;
}
	
/*
 * To get the original version that is installed
 *
 */
function getOriginalInstalledVersion()
{	
	var version;
	var upgHistory = getRecord("upgradehistory", "true");
	if(upgHistory != null && upgHistory.old_version!=null)
	{
		version = upgHistory.old_version;
		currentDate = upgHistory.date;
		while (upgHistory.getNext() == RC_SUCCESS && upgHistory.old_version!=null)
		{			
			if (upgHistory.date < currentDate)
			{
				currentDate = upgHistory.date;
				version = upgHistory.old_version;
			}		
		}					
	}	
	if(version != null)
	{
		return parseVersion(version);	
	}else
	{
		return getCurrentVersion();
	}
}	

	
/**
 * To get the default base version for 3-way merge
 *
 */
function getDefaultBaseVersion(postUpgrade) {	
	if (postUpgrade==null) {
	    postUpgrade=false;
	}
	
	//var originalVersion = getOriginalInstalledVersion();
	var baseVersion;
	if (postUpgrade) {
	    baseVersion = getUpgradeFromVersion();
	} else {
	    baseVersion = getCurrentVersion();
	}
	
	var supportedVersions = getSupportedBaseVersions();
	if(supportedVersions != null) {
		var startBaseVersion = getMajorMinorVersion(getFixedStartVersion());
		if (!lib.ArrayUtil.contains(supportedVersions, startBaseVersion)) {
		    supportedVersions.push(startBaseVersion);
		}
		var i;
		for(i = supportedVersions.length()-1; i >= 0 ; i--) {
			if(baseVersion.indexOf(supportedVersions[i]) == 0) {
				if (+supportedVersions[i] >= 9.5 || getPdVersion()=="") {
				    return supportedVersions[i];
				}
				else {
				    return supportedVersions[i]+"PD";
				}
			}
		}		
	}
	return null;
}
	
/**
 * To get the base version selected by user for 3 way merge
 *
 */
function getSupportedBaseVersions()
{
	var upgverbld = getRecord("upgverbld", "true");	
	if(upgverbld != null && upgverbld.automerge_versions != null)
	{			
		var baseversions = upgverbld.automerge_versions;
		var fromVersion = getUpgradeFromVersion();
		if(fromVersion != null){
			var i;
			for(i = baseversions.length()-1; i >= 0 ; i--)
			{
				if(fromVersion.indexOf(baseversions[i]) != 0)
				{
						baseversions = system.functions._delete(baseversions, i+1);
				}else
				{
					break;
				}				
			}	
		}				
		return baseversions;
	}else
	{
		return null;
	}
}
	
function isSupportedVersion(version) {
    var fullversions = lib.upgradeConstants.FULL_VERSIONS();
    var startVersionIndex = getVersionIndex(getFixedStartVersion());
    if (startVersionIndex < 0) {
        startVersionIndex = 0;
    }
    for (i=startVersionIndex; i<fullversions.length; i++) {
        if (fullversions[i] == version) {
            return true;
        }
    }
    
    return false;
}

function getVersionRadIndex(version) {
    if (version == null) {
        return -1;
    }
        
    var fullversions = lib.upgradeConstants.FULL_VERSIONS();
    return system.functions.index(version, fullversions);
}

function getVersionIndex(version) {
    return getVersionRadIndex(version)-1;
}

/**
 * To handle some special version. 
 * e.g. SM7-Dev
 */		
	
function parseVersion(version)
{
	if(version != null)
	{
		if (version.indexOf("SM7.0")==0 || version.indexOf("SM7-")==0 
		|| version.indexOf("SM 7.0")==0 || version.indexOf("7.0")==0
		|| version.indexOf("7.0-")==0)
		{
			version="SM7";
		}			
	}
	return version;	
} 

/**
 *  Trim the suffix of version with "_"
 *  For SMSP codes, the version of the signatures for SM9.50 is processed by special adding "_SMSP"
 *  When building, the special version is kept to make the signature and the record build in Upgrade Utility without skipping
 *  When applying, the suffix need to be trimmed and then the version is comparable in the version list.
 */
function trimVersionSuffix(version) {
    if (version != null) {
        version = version.split("_")[0];
    }
    
    return version;
}

function getRecord(table, query)
{
	var file = new SCFile(table);
	var rc = file.doSelect(query);
	if(rc == RC_SUCCESS){
		return file;
	}
	return null;
}


function getMajorVersion(version) {
    var pattern=new RegExp("^([0-9]+)\.([0-9]+)\.([0-9]+)");
    var match=pattern.exec(version);
	if (match!=null) {
	    return match[1];
	}
	return "";
}

function getMinorVersion(version) {
    var pattern=new RegExp("^([0-9]+)\.([0-9]+)\.([0-9]+)");
    var match=pattern.exec(version);
	if (match!=null) {
	    return match[2].substring(0, 1);
	}
	return "";
}

function getMinorMinorVersion(version) {
    var pattern=new RegExp("^([0-9]+)\.([0-9]+)\.([0-9]+)");
    var match=pattern.exec(version);
	if (match!=null) {
	    return match[2].substring(1, 2);
	}
	return "";
}

function getPatchVersion(version) {
    var pattern=new RegExp("^([0-9]+)\.([0-9]+)\.([0-9]+)");
    var match=pattern.exec(version);
	if (match!=null) {
	    return match[3];
	}
	return "";
}

function getMajorMinorVersion(version) {
    return getMajorVersion(version)+"."+getMinorVersion(version);
}

function getShortMajorMinorVersion(version) {
    return getMajorVersion(version)+""+getMinorVersion(version);
}

function getFullMajorMinorVersion(version) {
    return getMajorVersion(version)+"."+getMinorVersion(version)+getMinorMinorVersion(version);
}

function getShortFullMajorMinorVersion(version) {
    return getMajorVersion(version)+""+getMinorVersion(version)+getMinorMinorVersion(version);
}

function getFixedBaselineVersion() {
    var lightScript = lib.upgradeUtility.getLightScriptName();
    if (lib[lightScript] != null && lib[lightScript].BASELINE_VERSION != null) {
        var baselineVersion = lib[lightScript].BASELINE_VERSION();
        var baselineVersionIndex = getVersionIndex(baselineVersion);
        if (baselineVersionIndex >= 0) {
            return baselineVersion;
        }
    }
    return lib.upgradeConstants.BASELINE_VERSION();
}

function getFixedStartVersion() {
    var baselineVersion = getFixedBaselineVersion();
    var baselineVersionIndex = getVersionIndex(baselineVersion);
    var startVersion = lib.upgradeConstants.START_VERSION();
    var startVersionIndex = getVersionIndex(startVersion);
    
    if (startVersionIndex < baselineVersionIndex) {
        return baselineVersion;
    }
    
    return startVersion;
}
	