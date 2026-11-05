/*
	QCRQ1E53283
	
	Script Lib for Script Creation of 'data' Subfolder.
	@author Liu, Yong-liang
*/


/**
	create the "data" folder for the creation of custom upgrade package.
	return true, if the folder is created successfully;
		false, otherwise.
*/
function createDataFolder(parentFolder) {
    var datafolder=lib.upgradeFileHelper.getDataFolder();
	var packagefolder = getPackageFolder();
    var versionfolder = getVersionFolder();
	return createFolder(parentFolder, addFileSeperator(packagefolder) + addFileSeperator(versionfolder) + datafolder);
}

/**
	create a folder (and its parent folder if parent folder is specified and not created yet.
	return true, if the folder is created successfully;
			false, otherwise.
*/
function createFolder(parentFolder,folderName) {
	var folder;
	
	if (parentFolder == null || parentFolder == "") {
		return false;
	} else {
		folder = addFileSeperator(parentFolder) + folderName;
	}
	
	if (makeDir(folder) == 0) {
	  	return true;
	 } else {
	  	lib.upgradeLog.error(folderName + " folder creation failed for the folder: \""
	  		+ parentFolder + "\". Please specify the right path or make suer that you have write access to this folder.");
	  	return false;
	 }
	
}

/**
	add file seperator to the specified folder URL string.
*/
function addFileSeperator(folder) {
	if (folder.charAt(folder.length-1) == "/" || folder.charAt(folder.length-1) == "\\") {
		return folder;
	} else {
		//because RTE will take both "/" and "\" for consideration, so just choose one
		return folder + "/";
	}
}

/**
 * return package folder name.
 */
function getPackageFolder() {
    return "package";
}

/**
 * return version folder
 */
function getVersionFolder(isApply) {
    if (isApply == true) {
        return getApplyVersionFolder();
    }
    
    return getCreateVersionFolder();
}

function getApplyVersionFolder() {
    var currentVersion = lib.upgradeVersionUtil.getCurrentVersion();
    var currentShortMajorMinorVersionNumber = +lib.upgradeVersionUtil.getShortMajorMinorVersion(currentVersion);

    var mrVersion = lib.upgradeConstants.MR_VERSION();
    var mrShortMajorMinorVersionNumber = +lib.upgradeVersionUtil.getShortMajorMinorVersion(mrVersion);
    
    if (currentShortMajorMinorVersionNumber == mrShortMajorMinorVersionNumber) { // APM
        return lib.upgradeVersionUtil.getMajorMinorVersion(mrVersion);
    }
    
    if (currentShortMajorMinorVersionNumber >= 95) { // lightweight
        return "9.5";
    }
    
    return "9.3";
}

function getCreateVersionFolder() {
    var version = lib.upgradeVersionUtil.getFixedStartVersion();
    var majorVersion = lib.upgradeVersionUtil.getMajorVersion(version);
    if (majorVersion != null && majorVersion.length == 1) {
        return lib.upgradeVersionUtil.getMajorMinorVersion(version);
    }
    
    return lib.upgradeVersionUtil.getFullMajorMinorVersion(version);
}

