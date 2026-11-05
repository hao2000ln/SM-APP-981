/******************************************************
* Module Name: upgrade Constants
* Function: contain global constants can be used across RAD/ScriptLibrary and etc.
* Author: Upgrade team
* Version: 2.0
* Creation Date: Oct, 2011
* Update Date: Jan, 2024
*******************************************************/

/**
 * SM all versions supported in upgrade except the target version
 *
 * @returns {Array}
 */
function SUPPORT_VERSIONS() {
   	return [
   	    "SM7.10", 
   	    "7.11.000", "7.11.001", "7.11.002", "7.11.003", 
   	    "9.20.000", "9.21.001", "9.21.002", "9.21.003", 
   	    "9.30.000", "9.30.000 PDCP2",
   	    "9.30.001",
   	    "9.30.002", 
   	    "9.30.003",
   	    "9.31.0022", "9.31.0022 PDCP3", "9.31.0022 PDCP4",
   	    "9.32.0016", "9.32.0016 PDCP3", "9.32.0016 PDCP4",
   	    "9.33.0035", "9.33.0035 PDCP3", "9.33.0035 PDCP4",
   	    "9.34.0032", "9.34.0032 PDCP3", "9.34.0032 PDCP4",
   	    "9.35.0012", "9.35.0012 PDCP3", "9.35.0012 PDCP4",
   	    "9.40.0015", "9.40.0015 PD",
   	    "9.41.0020", "9.41.0020 PD",
   	    "9.50.0025", "9.51.0015", "9.52.0011", "9.52.1007", "9.52.2015",
   	    "9.60.0025", "9.60.0007", "9.61.0019", "9.62.0016", "9.63.0006", "9.64.0004",	// 9.60.0007 is SMA201802
   	    "9.70.0024", "9.71.0008", "9.72.0025",
   	    "9.80.0014", "9.80.0015"
	];
}

/**
 *  return MR version for the current Upgrade Utility
 */
function MR_VERSION() {
    return "9.80.0015";
}

/**
 * SM all versions supported in upgrade
 *
 * @returns {Array}
 */
function FULL_VERSIONS() { 
	var versions = SUPPORT_VERSIONS();
	versions.push(TARGET_VERSION());
	return versions;
}


/**
 * Version to upgrade to. This version number should be changed per release
 */
function TARGET_VERSION() { 
   var apps_version = TARGET_APPS_VERSION();
   if (apps_version != "APPS_VERSION") {
       return clean_version_revision(apps_version);
   }
   
   var upgverbldFile = lib.upgradeVersionUtil.getRecord("upgverbld", "true");
   if(upgverbldFile != null && upgverbldFile.version != null) {
       return clean_version_revision(upgverbldFile.version);
   }
   else {
       return "Unknown";
   }
}

function TARGET_APPS_VERSION() {
    return "9.81.0005";
}

function clean_version_revision(version) {
    var ver_split = version.split(" ");
    version = ver_split[0];
    var pattern=new RegExp("^([0-9]+\.[0-9]+\.[0-9]+[^\(\)\s]*)");
    var match=pattern.exec(version);
	if (match!=null) {
	    return match[1];
	}
	return version;
}


function BASELINE_VERSION() {
    return "SM7.10";
}

function START_VERSION() {
    return "9.30.000";
}


function NEW_PREFIX() {
	var fullversion=FULL_VERSIONS();
	var version=fullversion[fullversion.length-1];
	var pattern=new RegExp("^([0-9]+)\.([0-9]+)");
	var match=pattern.exec(version);
	if (match!=null) {
	    return "NEW"+match[1]+match[2];
	}
	return "NEWXXX";
}


function PATCH_NAME() {
	return "UPGRADE";
	//var version=TARGET_VERSION();
	//return "SM"+lib.upgradeVersionUtil.getShortMajorMinorVersion(version);
}


/**
 * Build date of the upgrade version.
 * TODO: Currently use fixed release date. This build date should be changed in a new field of upgverbld table per each upgrade build.
 */
function TARGET_BUILD_DATE() {
   var upgverbldFile = lib.upgradeVersionUtil.getRecord("upgverbld", "true");
   if(upgverbldFile != null && upgverbldFile.application_build_date != null) {
       return upgverbldFile.application_build_date;
   }
   else{ 
       var vDate=new Date(2024, 11, 1); // 2024.12
       return new XMLDate(vDate).getDatum();
   }
}
