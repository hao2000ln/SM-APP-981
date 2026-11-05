function getHotfixFiles(path) {
    var hotfixFiles = [];
    path = lib.upgradeUtility.getStandardPath(path);
    var configFile = path + "hotfix.txt";
    if (lib.upgradeUtility.isFile(configFile)) {
        var content = readFile(configFile, false);
        content = content.replace(/\r/, "");
        var filenames = content.split("\n");
        for (var i=0; i<filenames.length; i++) {
            if (filenames[i].length > 0) {
                hotfixFiles.push(filenames[i]);
            }
        }        
    }
    
    return hotfixFiles;    
}

function getHotfixPath(path) {
    path = lib.upgradeUtility.getStandardPath(path);
    var sep = lib.upgradeUtility.getPathSeperator();
    return path+"hotfix"+sep;
}
