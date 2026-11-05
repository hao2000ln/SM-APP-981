function getFileSuffix() {
    return "";
    /*
    var isUpgradeToPD = lib.upgradePDMigration.isUpgradeToPD();
    if (isUpgradeToPD)
        return "-pd";
    else
        return "";
    */
}

function getDataFolder() {
    var suffix = getFileSuffix();
    return "data"+suffix;
}

function getUpgradeInfName(language) {
    var suffix = getFileSuffix();
    if (language == null) {
        return "upgrade"+suffix+".inf";
    } else {
        return "upgrade"+suffix+"-"+language+".inf";
    }
}

// Only for upgrade language
function getUpgradeInfPrefix() {
    var suffix = getFileSuffix();
    return "upgrade"+suffix+"-";
}


// Return the language from upgrade.inf file name for non-English
function getUpgradeInfLang(filename) {
    var commonPrefix = "upgrade" + getFileSuffix() + "-";
    var length = filename.length;
    if (filename.indexOf(commonPrefix) == 0 && filename.lastIndexOf(".inf") == length - 4) {
        return filename.substring(commonPrefix.length, length - 4);
    }
    
    return "";
}