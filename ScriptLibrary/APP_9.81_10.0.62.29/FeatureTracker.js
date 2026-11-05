/* This scriptlibrary contains the code for the Feature tracker module */
/* Created: October 2017 */

var $ = lib.c.$;
var _ = lib.Underscore.require();
var _str = _.str;

/**
 * This function will get all modified objects from the watchdoc table
 * @param  {String} featureID 
 * @return {n/a} sets some RAD variables used in the forms
 */

function getObjects(featureID) {
    //initialize vars for pagination
    vars.$WTotal = -1;
    vars.$pagination_curPage = 0;
    vars.$pagination_totalPages = 0;
    if (null == vars.$pagination_itemsPerPage) {
        vars.$pagination_itemsPerPage = 20;
    }
    vars.$pagination_curPageStr = "";

    vars.$W_records_per_page = new SCDatum([10, 20, 50, 100]);
    //create filters for drop down fields
    vars.$watchDog_filter_table = new SCDatum([]);
    vars.$watchDog_filter_user = new SCDatum([]);
    vars.$watchDog_filter_feature = new SCDatum([]);
    vars.$watchDog_filter_release = new SCDatum([]);

    var watchdog = new SCFile("watchdog", SCFILE_READONLY);
    var query = 'select distinct table from watchdog';
    if (watchdog.doSelect(query) == RC_SUCCESS) {
        do {
            vars.$watchDog_filter_table.push(watchdog.table);
        } while (watchdog.getNext() == RC_SUCCESS);
    }

    query = 'select distinct user from watchdog';
    if (watchdog.doSelect(query) == RC_SUCCESS) {
        do {
            vars.$watchDog_filter_user.push(watchdog.user);
        } while (watchdog.getNext() == RC_SUCCESS);
    }

    query = 'select distinct feature from watchdog';
    if (watchdog.doSelect(query) == RC_SUCCESS) {
        do {
            if (watchdog.feature) {
                vars.$watchDog_filter_feature.push(watchdog.feature);
            }
        } while (watchdog.getNext() == RC_SUCCESS);
    }

    query = 'select distinct release from watchdog';
    if (watchdog.doSelect(query) == RC_SUCCESS) {
        do {
            if (watchdog.release) {
                vars.$watchDog_filter_release.push(watchdog.release);
            }
        } while (watchdog.getNext() == RC_SUCCESS);
        //localization
        vars.$watchDog_filter_release_local = vars.$watchDog_filter_release;
        let index = lib.ArrayUtil.indexOf(vars.$watchDog_filter_release_local, "unknown");
        if(index>-1){
            vars.$watchDog_filter_release_local[index] = funcs.scmsg("unknown","featuretracker");
        }
    }

    // generate paginated list  
    generatePaginatedList(featureID);
}

/**
 *  This function to maintain the pagenation of modified watchdog.
 *  @returns {String}   0       - Success
 *
 */
function generatePaginatedList(featureID) {
    vars.$watchDog_id = new SCDatum([]);
    vars.$watchDog_modified = new SCDatum([]);
    vars.$watchDog_flag = new SCDatum([]);
    vars.$watchDog_table = new SCDatum([]);
    vars.$watchDog_tag = new SCDatum([]);
    vars.$watchDog_user = new SCDatum([]);
    vars.$watchDog_feature = new SCDatum([]);
    vars.$watchDog_release = new SCDatum([]);

    var svnObj = new SCFile("watchdog", SCFILE_READONLY);
    svnObj.setFields(["id", "modified", "flags.file", "table", "user", "tag", "feature", "release"]);
    svnObj.setOrderBy(["modified"], [SCFILE_DSC]);

    //build query based on filter
    var query = setFilter(featureID);

    vars.$WTotal = svnObj.doCount(query);
    vars.$WCaption = system.functions.scmsg("total", "featuretracker", [vars.$WTotal]);
    vars.$pagination_totalPages = Math.ceil(vars.$WTotal / vars.$pagination_itemsPerPage);

    if (vars.$pagination_stepward == "next" && vars.$pagination_curPage < vars.$pagination_totalPages) {
        vars.$pagination_curPage++;
    }
    if (vars.$pagination_stepward == "previous" && vars.$pagination_curPage > 1) {
        vars.$pagination_curPage--;
    }
    if (vars.$pagination_curPage < 1) {
        vars.$pagination_curPage = 1;
    }
    if (vars.$pagination_curPage > vars.$pagination_totalPages) {
        vars.$pagination_curPage = vars.$pagination_totalPages;
    }

    var start = ((vars.$pagination_curPage - 1) * vars.$pagination_itemsPerPage) + 1;
    var rc = svnObj.doSelectEx(query, start, vars.$pagination_itemsPerPage);

    if (rc == RC_SUCCESS) {
        do {
            vars.$watchDog_id.push(svnObj.id);
            vars.$watchDog_modified.push(svnObj.modified);
            vars.$watchDog_flag.push(svnObj.flags_file);
            vars.$watchDog_table.push(svnObj.table);
            vars.$watchDog_tag.push(svnObj.tag);
            vars.$watchDog_user.push(svnObj.user);
            vars.$watchDog_feature.push(lib.KMUtils.scArrayToString(svnObj.feature));
            //localization
            let releases = svnObj.release;
            let index = lib.ArrayUtil.indexOf(releases, "unknown");
            if(index>-1){
               releases[index] = funcs.scmsg("unknown","featuretracker");
            }
            vars.$watchDog_release.push(lib.KMUtils.scArrayToString(releases));
            
        } while (svnObj.getNext() == RC_SUCCESS); 
    }

    vars.$pagination_curPageStr = " / " + vars.$pagination_totalPages;
    vars.$pagination_prev_enabled = (vars.$pagination_curPage > 1);
    vars.$pagination_next_enabled = (vars.$pagination_curPage < vars.$pagination_totalPages);

    vars.$pagination_stepward = "";
}

/**
 *  This function to maintain the pagenation of related watchdog.
 *  @returns {String}   0       - Success
 *
 */
function relatedGeneratePaginatedList(featureID) {
    vars.$related_id = new SCDatum([]);
    vars.$related_modified = new SCDatum([]);
    vars.$related_flag = new SCDatum([]);
    vars.$related_table = new SCDatum([]);
    vars.$related_tag = new SCDatum([]);
    vars.$related_user = new SCDatum([]);
    vars.$related_feature = new SCDatum([]);
    vars.$related_release = new SCDatum([]);
    vars.$related_status = new SCDatum([]);

    var svnObj = new SCFile("watchdog", SCFILE_READONLY);
    svnObj.setFields(["id", "modified", "flags.file", "table", "user", "tag", "feature", "release", "commit.time", "commit.revision", "commit.by", "status"]);
    svnObj.setOrderBy(["table"], [SCFILE_ASC]);

    var query = 'feature="' + featureID + '"';

    vars.$R_WTotal = svnObj.doCount(query);
    vars.$R_WCaption = system.functions.scmsg("total", "featuretracker", [vars.$R_WTotal]);
    vars.$R_pagination_totalPages = Math.ceil(vars.$R_WTotal / vars.$R_pagination_itemsPerPage);

    if (vars.$R_pagination_stepward == "next" && vars.$R_pagination_curPage < vars.$R_pagination_totalPages) {
        vars.$R_pagination_curPage++;
    }
    if (vars.$R_pagination_stepward == "previous" && vars.$R_pagination_curPage > 1) {
        vars.$R_pagination_curPage--;
    }
    if (vars.$R_pagination_curPage < 1) {
        vars.$R_pagination_curPage = 1;
    }
    if (vars.$R_pagination_curPage > vars.$R_pagination_totalPages) {
        vars.$R_pagination_curPage = vars.$R_pagination_totalPages;
    }

    var start = ((vars.$R_pagination_curPage - 1) * vars.$R_pagination_itemsPerPage) + 1;
    var rc = svnObj.doSelectEx(query, start, vars.$R_pagination_itemsPerPage);

    if (rc == RC_SUCCESS) {
        do {
            vars.$related_id.push(svnObj.id);
            vars.$related_modified.push(svnObj.modified);
            vars.$related_flag.push(svnObj.flags_file);
            vars.$related_table.push(svnObj.table);
            vars.$related_tag.push(svnObj.tag);
            vars.$related_user.push(svnObj.user);
            vars.$related_feature.push(lib.KMUtils.scArrayToString(svnObj.feature));
            //localization
            let releases = svnObj.release;
            let index = lib.ArrayUtil.indexOf(releases, "unknown");
            if(index>-1){
               releases[index] = funcs.scmsg("unknown","featuretracker");
            }
            vars.$related_release.push(lib.KMUtils.scArrayToString(releases));
            if (svnObj.status == "closed") {
                vars.$related_status.push(svnObj.commit_by + ", " + funcs.str(svnObj.commit_time) + ", " + svnObj.commit_revision);
            } else {
                var msg = system.functions.scmsg("new", "featuretracker");
                vars.$related_status.push(msg);
            }
            var rcNext = svnObj.getNext();
        } while (rcNext == RC_SUCCESS);
    }

    vars.$R_pagination_curPageStr = " / " + vars.$R_pagination_totalPages;
    vars.$R_pagination_prev_enabled = (vars.$R_pagination_curPage > 1);
    vars.$R_pagination_next_enabled = (vars.$R_pagination_curPage < vars.$R_pagination_totalPages);

    vars.$R_pagination_stepward = "";
}

/**
 * This function will generate a query based on the filter criterias entered into the form
 * 
 */

function setFilter(featureID) {
    var _sf = system.functions;
    var sQueryTmp = "true";

    if (vars.$filter_start_date != "" && vars.$filter_start_date != null) {
        sQueryTmp += " and modified>='" + vars.$filter_start_date + "'";
    }
    if (vars.$filter_end_date != "" && vars.$filter_end_date != null) {
        sQueryTmp += " and modified<='" + vars.$filter_end_date + "'";
    }
    if (vars.$filter_table != "" && vars.$filter_table != null) {
        sQueryTmp += " and table=\"" + vars.$filter_table + "\"";
    }

    if (vars.$filter_user != "" && vars.$filter_user != null) {
        sQueryTmp += " and user=\"" + vars.$filter_user + "\"";
    }

    if (vars.$filter_feature != "" && vars.$filter_feature != null) {
        sQueryTmp += " and feature=\"" + vars.$filter_feature + "\"";
    }

    if (vars.$filter_release != "" && vars.$filter_release != null) {
        sQueryTmp += " and release=\"" + vars.$filter_release + "\"";
    }

    if (featureID) {
        sQueryTmp += " and not (feature = \"" + featureID + "\")";
    }
    return sQueryTmp;
}
/**
 * This function cleanup the filter used in the form
 * 
 */

function clearFilter() {
    vars.$filter_start_date = "";
    vars.$filter_end_date = "";
    vars.$filter_table = "";
    vars.$filter_user = "";
    vars.$filter_feature = "";
    vars.$filter_release = "";
}

/**
 * This function will get all objects linked with the feature from the WatchDog table
 * 
 * @param  {String} featureID 
 * @return {n/a} sets some RAD variables used in the forms
 */

function getlinkedObjects(featureID) {
    //initialize vars for pagination
    vars.$R_WTotal = -1;
    vars.$R_pagination_curPage = 0;
    vars.$R_pagination_totalPages = 0;
    if (null == vars.$R_pagination_itemsPerPage) {
        vars.$R_pagination_itemsPerPage = 20;
    }
    vars.$R_pagination_curPageStr = "";

    vars.$R_W_records_per_page = new SCDatum([10, 20, 50, 100]);
    // generate paginated list  
    relatedGeneratePaginatedList(featureID);
}

/**
 * This function will return the Relase IDs for the drop down list
 * 
 * @param  {String} releaseID 
 * @return {Array} List of Release IDs
 */

function getReleaseNumbers(onlyActive, status) {
    if (onlyActive === null) {
        onlyActive = true;
    }
    var releaseList = [];
    var releases = new SCFile("featuretracker", SCFILE_READONLY);
    releases.setFields(["release"]);
    releases.setOrderBy(["release"], [SCFILE_ASC]);

    var query = 'type="release"';
    if (onlyActive == true) {
        query = 'type="release" and active=true';
        if (status != "Ready to release") {
            query = query + ' and status~="Ready to release"';
        }
    }
    if (releases.doSelect(query) == RC_SUCCESS) {
        do {
            if (releases.release != null) {
                releaseList.push(releases.release);
            }
        } while (releases.getNext() == RC_SUCCESS);
    }

    return releaseList;
}

/**
 * This function is to link features with the watchdogID.
 * @param  {String} featureId 
 * @param  {String} releasedId 
 * @param  {String} watchdogId 
 */
function linkObjects(featureID, releaseID, watchdogID) {
    var query = 'id="' + watchdogID + '"';
    var watchdog = new SCFile("watchdog");
    var rc = watchdog.doSelect(query);

    if (rc == RC_SUCCESS) {
        var indexFeature = system.functions.index(featureID, watchdog.feature);
        if (indexFeature == 0) {
            watchdog.feature = system.functions.insert(watchdog.feature, 0, 1, featureID);
        }

        var indexRelease = system.functions.index(releaseID, watchdog.release);
        if (indexRelease == 0) {
            watchdog.release = system.functions.insert(watchdog.release, 0, 1, releaseID);
        }
        var rcSave = watchdog.doUpdate();
    }
}

/**
 * This function is to link features with the watchdogID.
 * @param  {String} featureId 
 * @param  {String} releasedId 
 * @param  {String} watchdogId 
 */
function unlinkObjects(featureID, releaseID, watchdogID) {
    var query = 'id="' + watchdogID + '"';
    var watchdog = new SCFile("watchdog");
    var rc = watchdog.doSelect(query);
    if (rc == RC_SUCCESS) {
        //check if already commited, if yes, dont allow to unlink until reverted.
        //if (!watchdog.commit_revision)
        //{
        var indexFeature = system.functions.index(featureID, watchdog.feature);
        var numberFeatures = system.functions.lng(system.functions.denull(watchdog.feature));
        if (indexFeature > 0) {
            watchdog.feature = system.functions._delete(watchdog.feature, indexFeature);
        }

        //cleanup release array
        var numberReleases = system.functions.lng(system.functions.denull(watchdog.release));
        watchdog.release = system.functions._delete(watchdog.release, 1, numberReleases);
        // get release IDs from features
        var a;
        var l = system.functions.lng(system.functions.denull(watchdog.feature));
        for (a = 0; a < l; a++) {
            query = "id=\"" + watchdog.feature[a] + "\"";
            var ft = new SCFile("featuretracker", SCFILE_READONLY);
            ft.setFields(["release"]);
            rc = ft.doSelect(query);
            if (rc == RC_SUCCESS) {
                var indexRelease = system.functions.index(ft.release, watchdog.release);
                if (indexRelease == 0) {
                    watchdog.release = system.functions.insert(watchdog.release, 0, 1, ft.release);
                }
            }
        }
        var rcSave = watchdog.doUpdate();
        //}
    }
}

/**
 * This function will validate whether an object belongs to several releases during the commit.
 * @param  {String} featureID 
 * @return {Boolean} true; more than one release; false one release 
 */
function validateObjectsRelease(featureID) {
    var query = 'feature="' + featureID + '"';
    var watchdog = new SCFile("watchdog", SCFILE_READONLY);
    watchdog.setFields(["id", "feature", "release"]);

    var rc = watchdog.doSelect(query);
    if (rc == RC_SUCCESS) {
        do {
            var retVal = false;
            if (system.functions.lng(system.functions.denull(watchdog.release)) > 1) {
                retVal = true;
                break;
            }
            var rcNext = watchdog.getNext();
        } while (rcNext == RC_SUCCESS);
    }
    return retVal;
}

/**
 * This function will validate whether some objects of the releated related belong to several releases. 
 * @param  {String} featureID 
 * @return {Boolean} true; more than one release; false one release 
 */
function validateRelease(releaseID) {
    var query = "release=\"" + releaseID + "\"";
    var ft = new SCFile("featuretracker", SCFILE_READONLY);
    ft.setFields(["id"]);
    var arrayFeatures = [];
    var rc = ft.doSelect(query);
    if (rc == RC_SUCCESS) {
        do {
            var retVal = validateObjectsRelease(ft.id);
            if (retVal == true) {
                arrayFeatures.push(ft.id);
            }
            var rcNext = ft.getNext();
        } while (rcNext == RC_SUCCESS);
    }
    return arrayFeatures;
}


/**
 * This function is used to check whether SVN or GIT integration is active to call the correct code
 * 
 * @param  {String} releaseID 
 * @param  {boolean} scheduled, specifies whether the release build is scheduled 
 */

function buildRelease(releaseID, scheduled) {
    if (lib.DevOpsBase.isSvn()) {
        buildReleaseSVN(releaseID, scheduled);
    } else if (lib.DevOpsBase.isGit()) {
        buildReleaseGit(releaseID, scheduled);
    }
}

function makeReleaseName(releaseID) {
    releaseID = releaseID.replace(/[ \\~\^\:]/g, '');
    releaseID = releaseID.replace(/\.{2,}/g, '');
    releaseID = releaseID.replace(/\.lock/g, '');
    releaseID = releaseID.replace(/\.lock$/g, '');
    releaseID = releaseID.replace(/\/$/g, '');

    return "R" + releaseID;
}

function buildReleaseGit(releaseID, scheduled) {
    var svc_root = getRTEParm('svc_rootdir');
    var curDateTime = dateTag();

    var releaseName = makeReleaseName(releaseID);
    var releaseTag = releaseName + "_" + curDateTime;
    var releasefolder = releaseName + "/";

    var tempFolder = lib.FeatureSettings.getGlobalSettings().tempFolder;

    var releaseMsg = releaseID + " - " + system.functions.scmsg("releaseCopyFiles", "featuretracker"); // - Copy files for release";
    var releaseFolderMsg = releaseID + " - " + system.functions.scmsg("releaseCreateFolder", "featuretracker"); //- Create release folder ";

    var readmeAdd = system.functions.scmsg("releaseAdd", "featuretracker") + "<br>\n"; //"-------------Add File List----------- ";
    var readmeUpdate = system.functions.scmsg("releaseUpdate", "featuretracker") + "<br>\n"; //"-------------Update File List----------- ";
    var readmeDelete = system.functions.scmsg("releaseDelete", "featuretracker") + "<br>\n"; //"-------------Delete File List----------- ";
    var readmeDbdictUpdate = system.functions.scmsg("releaseDBDICT", "featuretracker") + "<br>\n"; //-------------DBDICT Changes ----------- ";

    //go to the watch dog table and build an array which includes all objects related to the feature/release identified by its path
    var objects = buildObjectList(releaseID);
    var hasAdded = false;
    var hasUpdated = false;
    var hasDeleted = false;
    var hasDbdictChange = false;

    if (objects.length > 0) {
        var fullBase = mkdir(tempFolder, releasefolder);
        if (scheduled == false) {
            var msg = funcs.scmsg("prepare release files", "featuretracker");
            printMessage(msg, 1);
        }
        var i;
        for (i = 0; i < objects.length; i++) {
            var line = objects[i].path;
            if (_str.endsWith(line, ".xml")) {
                var filePath = line.substr(line.indexOf("*") + 1);
                var folder = filePath.substr(0, filePath.lastIndexOf("/") + 1);

                if (_str.startsWith(line, "A")) {
                    readmeAdd = readmeAdd + line + "<br>\n";
                    hasAdded = true;
                } else if (_str.startsWith(line, "M") || _str.startsWith(line, "U")) {

                    if (_str.contains(line, "*dbdict/")) {
                        readmeDbdictUpdate = readmeDbdictUpdate + line + "<br>\n";
                        hasDbdictChange = true;
                    } else {
                        readmeUpdate = readmeUpdate + line + "<br>\n";
                        hasUpdated = true;
                    }
                } else if (_str.startsWith(line, "D")) {
                    readmeDelete = readmeDelete + line + "<br>\n";
                    hasDeleted = true;
                } else {
                    readmeAdd = readmeAdd + line + "<br>\n";
                    hasAdded = true;
                }

                if (!_str.startsWith(line, "D")) {
                    var fileName = filePath.substr(filePath.lastIndexOf("/") + 1, filePath.length);
                    var to = addPath('data/', folder);
                    var target = addPath(mkdir(fullBase, to), fileName);
                    if (head == null) {
                        var fullPath = lib.SysUtil._trimStr(sysExec('git -C "' + svc_root + '" ls-files --full-name "' + filePath + '"')[2]);
                        var head = fullPath.split(filePath)[0];
                    }
                    var absolutePath = filePath;
                    if (head) {
                        absolutePath = addPath(head, filePath).replace(/\\/g, "/");
                    }
                    var excute = 'git -C "' + svc_root + '" show ' + objects[i].revision + ':"' + absolutePath + '" > "' + target + '"';
                    sysExec(excute);
                }
            }
        }

        if (scheduled == false) {
            var msg = funcs.scmsg("generate documentation", "featuretracker");
            printMessage(msg, 1);
        }
        var release = getRelease(releaseID); //get the full release
        var documentation = release.documentation;
        if (!documentation) {
            documentation = '';
        }
        documentation = documentation + "<br>\n<h3>" + system.functions.scmsg("ModifiedObjects", "featuretracker") + "</h3>"; //**************  Modified Objects  *************

        if (hasAdded) {
            documentation = documentation + "<br>\n" + readmeAdd;
        }

        if (hasUpdated) {
            documentation = documentation + "<br>\n" + readmeUpdate;
        }

        if (hasDeleted) {
            documentation = documentation + "<br>\n" + readmeDelete;
        }

        if (hasDbdictChange) {
            documentation = documentation + "<br>\n" + readmeDbdictUpdate + "<br>\n";
        }

        //write file
        try {
            // var fileName = fullBase + "/Doc_R" + releaseID + ".html";
            var fileName = addPath(fullBase, "Doc_R" + releaseID + ".html");
            writeFile(fileName, "t", documentation);
        } catch (ex) {
            throw "cannot write text file: " + fileName + " - " + ex;
        }
        var next = makeGitRelease(releaseID, releaseName, releaseTag, fullBase);
        saveRelease(releaseID, next);
    } else {
        if (scheduled == false) {
            var msg = funcs.scmsg("no related objects found", "featuretracker");
            printMessage(msg, 1);
        }
    }
}

function saveRelease(id, next) {
    var release = vars['$L.file'];
    if (!vars['$L.file'] || vars['$L.file'].release != id) {
        var sql = 'release=:0 and type = "release"';
        release = lib.c.$('!featuretracker', true).find(sql, id).one();
    }
    var data;
    if (release.data) {
        data = rteJSONParse(release.data);
    } else {
        data = [];
    }

    next.title = id + ': ' + release.title;
    data.push(next);
    release.data = rteJSONStringify(data);
    release.doUpdate();
}

function trimLastCharOfFolder(folder) {
    var last = folder.charAt(folder.length - 1);

    if (last == '/' || last == '\\') {
        folder = folder.substring(0, folder.length - 1);
    }

    return folder;
}

function makeGitRelease(id, name, tag, folder) {
    folder = trimLastCharOfFolder(folder);

    var GIT = 'git -C "' + folder + '" ';

    sysExec('git init "' + folder + '"');
    sysExec(GIT + ' checkout -b SM');
    sysExec(GIT + ' add . ');
    sysExec(GIT + ' commit ' + ' --author "' + lib.DevOpsBase4Git.getAuthor() + '" -m "create release: ' + name + '"');

    tag = tag.replace(/[\/\"\\]/g, '');

    sysExec(GIT + ' tag ' + tag + '');

    var releaseUrl = lib.FeatureSettings.getGlobalSettings().releaseURL;
    sysExec(GIT + ' remote add release ' + releaseUrl);
    var res = sysExec(GIT + ' push -u release ' + tag + '');
    var msg = null;
    if (res[1] == 0) {
        msg = funcs.scmsg("Create Release", "featuretracker", [tag, releaseUrl]);
        printMessage(msg, 1);
        vars.$featureAction = "buildSuccess";
        vars.$actionDescription = "Triggered a build and build succeded. Created a Tag:" + tag;
    } else {
        msg = funcs.scmsg("Create Release Failed", "featuretracker");
        printMessage(msg, 1);
        vars.$featureAction = "buildFailed";
        vars.$actionDescription = "Triggered a build but the build failed.";
    }
    if (vars.$L_file) {
        lib.ActivityLog.createActivityLog(vars.$L_file, vars.$L_file_save, "build");
    } else {
        var file = new SCFile("featuretracker", SCFILE_READONLY);
        var query = 'release="' + id + '" and type="release"';
        var rc = file.doSelect(query);
        if (rc == RC_SUCCESS) {
            lib.ActivityLog.createActivityLog(file, file, "build");
        }
    }
    vars.$featureAction = null;
    vars.$actionDescription = null;

    return {
        name: name,
        type: 'git',
        tag: tag,
        url: releaseUrl
    };
}

/**
 * This function will build the release and add it into SVN. It will also build the documentation and exports the release to a folder outside the SVN repository
 * 
 * @param  {String} releaseID 
 * @param  {boolean} scheduled, specifies whether the release build is scheduled 
 */

function buildReleaseSVN(releaseID, scheduled) {
    var release = getRelease(releaseID); //get the full release
    var curDateTime = dateTag();

    var sourcecodeURL = getSvnSourceCodeUrl();
    if (sourcecodeURL && !lib.c.$.endsWith(sourcecodeURL, '/')) {
        sourcecodeURL += '/';
    }

    var releasefolder = "R" + releaseID + "_" + curDateTime + "/";
    var releaseURL = lib.FeatureSettings.getGlobalSettings().releaseURL;
    if (releaseURL && !lib.c.$.endsWith(releaseURL, '/')) {
        releaseURL += '/';
    }
    releaseURL = releaseURL + releasefolder;
    var releaseDocURL = releaseURL + "doc.html";
    var releaseMsg = releaseID + " - " + system.functions.scmsg("releaseCopyFiles", "featuretracker"); // - Copy files for release";
    var releaseFolderMsg = releaseID + " - " + system.functions.scmsg("releaseCreateFolder", "featuretracker"); //- Create release folder ";
    var readmeAdd = system.functions.scmsg("releaseAdd", "featuretracker") + "<br>\n"; //"-------------Add File List----------- ";
    var readmeUpdate = system.functions.scmsg("releaseUpdate", "featuretracker") + "<br>\n"; //"-------------Update File List----------- ";
    var readmeDelete = system.functions.scmsg("releaseDelete", "featuretracker") + "<br>\n"; //"-------------Delete File List----------- ";
    var readmeDbdictUpdate = system.functions.scmsg("releaseDBDICT", "featuretracker") + "<br>\n"; //-------------DBDICT need to be manually updated in Service Manager----------- ";

    var msg = null;
    if (scheduled == false) {
        msg = funcs.scmsg("get committed objects", "featuretracker");
        printMessage(msg, 1);
    }
    //go to the watch dog table and build an array which includes all objects related to the feature/release identified by its path
    var objects = buildObjectList(releaseID);
    if (objects.length > 0) {
        var i;
        for (i = 0; i < objects.length; i++) {
            if (scheduled == false) {
                msg = funcs.scmsg("prepare release files", "featuretracker");
                printMessage(msg, 1);
            }
            var line = objects[i];
            if (_str.endsWith(line, ".xml")) {
                var objectURL = sourcecodeURL + line.substr(line.indexOf("*") + 1);
                var temp = objectURL.substr(objectURL.indexOf("data"));
                var folder = temp.substr(0, temp.lastIndexOf("/") + 1);
                var directory = releaseURL + folder;
                var svncopy;
                var rcCopy;
                if (_str.startsWith(line, "A") || _str.startsWith(line, "?")) {
                    //Do not use "svn info" to check whether the directory existed or not, since it needs more connection than use "svn mkdir" directly.        
                    svncopy = "svn mkdir --parents -m \"" + releaseFolderMsg + "\" " + directory;
                    rcCopy = sysExec(svncopy);
                    //copy the files to release folder
                    var svncopy2 = "svn copy -r " + objectURL + " " + directory + " -m \"" + releaseMsg + "\"";
                    var rcCopy2 = sysExec(svncopy2);
                    readmeAdd = readmeAdd + line + "<br>\n";
                } else if (_str.startsWith(line, "M") || _str.startsWith(line, "U")) {
                    svncopy = "svn mkdir --parents " + directory + " -m \"" + releaseFolderMsg + "\"";
                    rcCopy = sysExec(svncopy);
                    if (_str.contains(line, "*dbdict/")) {
                        readmeDbdictUpdate = readmeDbdictUpdate + objectURL + "<br>\n";
                    }

                    //copy the files to release folder
                    var svncopy3 = "svn copy " + objectURL + " " + directory + " -m \"" + releaseMsg + "\"";
                    var rcCopy3 = sysExec(svncopy3);
                    readmeUpdate = readmeUpdate + objectURL + "<br>\n";

                } else if (_str.startsWith(line, "D")) {
                    readmeDelete = readmeDelete + objectURL + "<br>\n";
                }
            }

        }
        if (scheduled == false) {
            msg = funcs.scmsg("generate documentation", "featuretracker");
            printMessage(msg, 1);
        }
        var documentation = release.documentation + "<br>\n<h3>" + system.functions.scmsg("ModifiedObjects", "featuretracker") + "</h3>"; //**************  Modified Objects  *************
        documentation = documentation + "<br>\n" + readmeAdd;
        documentation = documentation + "<br>\n" + readmeUpdate;
        documentation = documentation + "<br>\n" + readmeDelete;
        documentation = documentation + "<br>\n" + readmeDbdictUpdate;
        documentation = documentation + '<br>\n';
        //write file
        try {
            var OUTPUT_DIR = "../SMReleases/"; //SM directory as temp storage place
            makeDir(OUTPUT_DIR);
            var fileName = OUTPUT_DIR + "Doc_R" + releaseID + ".html";
            writeFile(fileName, "t", documentation);
        } catch (ex) {
            throw "cannot write text file: " + fileName + " - " + ex;
        }

        //import into SVN
        var importmsg = "R" + releaseID + system.functions.scmsg("releaseDocumentation", "featuretracker"); //" - Release Documentation";
        var svnimport = "svn import -m \"" + importmsg + "\" " + fileName + " " + releaseDocURL;
        var rcimport = sysExec(svnimport);

        if (scheduled == false) {
            msg = funcs.scmsg("export release", "featuretracker");
            printMessage(msg, 1);
        }
        var tempFolder = lib.FeatureSettings.getGlobalSettings().tempFolder;
        var svnexport = "svn export " + releaseURL + " " + addPath(tempFolder, releasefolder);
        rcimport = sysExec(svnexport);

        var last = {
            name: "R" + releaseID,
            type: 'svn',
            url: releaseURL
        };
        saveRelease(releaseID, last);
        msg = funcs.scmsg("Release created", "featuretracker", [releaseURL]);
        printMessage(msg, 1);
        if (scheduled == false) {
            msg = funcs.scmsg("finished", "featuretracker");
            printMessage(msg, 1);
        }
    } else {
        if (scheduled == false) {
            msg = funcs.scmsg("no related objects found", "featuretracker");
            printMessage(msg, 1);
        }
    }
}

/**
 * This function will loop through the watchdog table and build an array which includes all objects 
 * related to the release (via the feature). Each object is identified by its path and revision
 * @param  {String} releaseID 
 * @return {Array of Object} list of object by path and revision
 */

function buildObjectList(releaseID) {
    //get features linked with the release
    var features = new SCFile("featuretracker", SCFILE_READONLY);
    features.setFields(["id"]);
    var queryFT = "type=\"feature\" and status~=\"New\" and status~=\"Cancelled\" and release=\"" + releaseID + "\"";
    var rc = features.doSelect(queryFT);
    var arrFeatures = [];
    var objects = [];
    var map = new Map();
    if (rc == RC_SUCCESS) {
        do {
            arrFeatures.push(features.id);
        } while (features.getNext() == RC_SUCCESS);

        //get objects linked with the feature
        var i;
        for (i = 0; i < arrFeatures.length; i++) {
            let watchdog = new SCFile("watchdog", SCFILE_READONLY);
            watchdog.setFields(["path", "flags.file", "commit.revision", "commit.time"]);
            let queryWD = "not null(commit.revision) and feature=\"" + arrFeatures[i] + "\"";
            rc = watchdog.doSelect(queryWD);
            while (rc == RC_SUCCESS) {
                let path = watchdog.path;
                let time = watchdog.commit_time;
                if (!map.has(path) || (time > map.get(path)[2])) {
                    map.set(path, [watchdog.commit_revision, watchdog.flags_file, time]);
                }
                rc = watchdog.getNext();
            }
        }

        map.forEach(function(value, key) {
            objects.push({
                path: value[1] + "*" + key.replace(/\\/g, "/"),
                revision: value[0]
            });
        });
    }
    return objects;
}

/**
 * This function will loop through releases to check if the release number is used already 
 * 
 * @param  {String} releaseID 
 * @return {boolean} true, release number already exists, false, release number doesnt exist
 */

function checkDuplicateReleaseNumber(releaseID) {
    var release = new SCFile("featuretracker", SCFILE_READONLY);
    release.setFields(["id"]);
    var query = "type=\"release\" and release=\"" + releaseID + "\" and release~=\"unknown\"";
    var rc = release.doCount(query);
    if (rc > 0) {
        return true;
    }
    return false;
}

function validateStatus(release) {
    var status = release.status;
    var feature = new SCFile("featuretracker", SCFILE_READONLY);
    feature.setFields(["id"]);
    if (status == "Ready to release" || status == "Done") {
        var queryFT = generateSqlbyStatus(status, release.release);
        if (feature.doSelect(queryFT) == RC_SUCCESS) {
            return false;
        }
    }
    return true;
}

function statusMessage(release) {
    var status = release.status;
    var str = "";
    var feature = new SCFile("featuretracker", SCFILE_READONLY);
    feature.setFields(["id"]);
    var queryFT = generateSqlbyStatus(status, release.release);
    if (feature.doSelect(queryFT) == RC_SUCCESS) {
        var i = 0;
        do {
            if (i == 0) {
                i = 1;
                str += feature.id;
            } else {
                str += "," + feature.id;
            }
        } while (feature.getNext() == RC_SUCCESS);
    }

    if (status == "Ready to release") {
        return funcs.scmsg("validate_4", "featuretracker", [str]);
    } else if (status == "Done") {
        return funcs.scmsg("validate_5", "featuretracker", [str]);
    }
}

function generateSqlbyStatus(status, releasNumber) {
    var arr = ["Done", "Cancelled"];
    if (status == "Ready to release") {
        arr.push("Ready to release");
    }
    var queryFT = "type=\"feature\" and not status isin" + funcs.str(arr) + "and release=\"" + releasNumber + "\"";
    return queryFT;
}

function validateFeatureStatus(feature) {
    var status = feature.status;
    var releaseNumber = feature.release;
    if (releaseNumber == "unknow") {
        return true;
    }
    var release = new SCFile("featuretracker", SCFILE_READONLY);
    release.setFields(["status"]);
    var query = 'type ="release" and release= "' + releaseNumber + '"';
    if (release.doSelect(query) == RC_SUCCESS) {
        var releaseStatus = release.status;
        if (releaseStatus == "Done" && status != "Done") {
            return false;
        } else if (releaseStatus == "Ready to release" && status != "Ready to release" && status != "Done") {
            return false;
        } else {
            return true;
        }
    }
}

function validateFeatureMessage(feature) {
    var status = feature.status;
    var releaseNumber = feature.release;
    var release = new SCFile("featuretracker", SCFILE_READONLY);
    release.setFields(["status"]);
    var query = 'type ="release" and release= "' + releaseNumber + '"';
    if (release.doSelect(query) == RC_SUCCESS) {
        var index = lib.ArrayUtil.indexOf(vars.$StatusValueList, status);
        var statusLocal = vars.$StatusDisplayList[index];
        index = lib.ArrayUtil.indexOf(vars.$StatusValueList, release.status);
        var releaseStatusLocal = vars.$StatusDisplayList[index];
        var message = funcs.scmsg("validate_6", "featuretracker", [statusLocal, releaseStatusLocal]);
        return message;
    }
}

/**
 * This function check if the release number is composed of a-z,A-Z,0-9,-,_,and spaces.
 * 
 * @param  {String} releaseID 
 * @return {boolean} true, release number is invalid, false, release number is valid
 */
function checkValidReleaseNumber(releaseId) {
    var reg = /^[\w\s\-]+$/;
    return reg.test(releaseId);
}

/**
 * This function will loop through all features linked with the release and create a release documentation
 * 
 * @param  {String} releaseID 
 * @return {string} HTML
 */

function createReleaseDocumentation(releaseID) {
    var sCR = "\n";
    var sHtmlReturn = lib.timeperiodCSS.getCSS();

    //initialise features
    //get features linked with the release
    var features = new SCFile("featuretracker", SCFILE_READONLY);
    features.setFields(["id", "documentation", "title"]);
    var queryFT = "type=\"feature\" and status~=\"New\" and status~=\"Cancelled\" and release=\"" + releaseID + "\"";

    var rc = features.doSelect(queryFT);
    if (rc == RC_SUCCESS) {

        //prepare HTML view       
        sHtmlReturn += "<br><br><table class=\"TableResults\" width=\"100%\">" + sCR;

        // Table header          
        sHtmlReturn += "<tr><th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + system.functions.scmsg("featureID", "featuretracker") + "</span></div></div></th>";
        sHtmlReturn += "    <th class=\"TableHeading\"><div style=\"border-bottom: solid 1px #888;border-left: solid 1px #888;\"><div tabindex=\"0\" class=\"table-hd-inner\"><span class=\"TableHeadingText\">" + system.functions.scmsg("featureDOC", "featuretracker") + "</span></div></div></th></tr>";

        while (getLastRC() == RC_SUCCESS) {
            // build HTML
            var sRowClass = "TableCellResults";
            sHtmlReturn += "<tr class=\"TableNormalRow\">";
            sHtmlReturn += "<td class=\"" + sRowClass + "\"><div class=\"shadowFocus\" tabindex=\"0\"><div class=\"Text FormatTableElementReadonly\"><span class=\"xTableCell FormatTableElementReadonly\" style=\"text-decoration:underline;color:#0000FF;\">" + features.id + " - " + features.title + "</span></div></div></td>";
            sHtmlReturn += "<td class=\"" + sRowClass + "\"><div class=\"shadowFocus\" tabindex=\"0\"><div class=\"Text FormatTableElementReadonly\"><span class=\"xTableCell FormatTableElementReadonly\">" + features.documentation + "</span></div></div></td>";
            sHtmlReturn += "</tr>" + sCR;
            var rcNext = features.getNext();
        } // while records

        sHtmlReturn += "</table>" + sCR;
        return sHtmlReturn;
    }

    return null;
}

/**
 * This function will get the release record
 * 
 * @param  {String} releaseID 
 * @return {record} 
 */

function getRelease(releaseID) {
    var release = new SCFile("featuretracker", SCFILE_READONLY);
    var query = "type=\"release\" and release=\"" + releaseID + "\"";
    if (release.doSelect(query) == RC_SUCCESS) {
        return release;
    }
}

function getSchedule(releaseId) {
    var name = 'Feature Tracker - Build Release: ' + releaseId;
    return lib.c.$('!schedule', true).find('name=:0', name).one();
}

function initBuildReleaseSchedule(releaseId) {
    var sch = getSchedule(releaseId);

    vars["$feature.build.release.sch.status"] = "";
    if (null == vars["$feature.build.release.start"]) {
        vars["$feature.build.release.start"] = system.functions.tod();
    }

    if (null == vars["$feature.build.release.end"]) {
        vars["$feature.build.release.end"] = addInterval(system.functions.tod(), system.functions.val('1 00:00:00', 3));
    }

    if (null == vars["$feature.build.release.repeat"]) {
        vars["$feature.build.release.repeat"] = system.functions.val('00:30:00', 3);
    }

    vars['$L.running'] = false;
    vars['$L.status'] = system.functions.scmsg("scheduleStatus", "featuretracker");

    if (sch != null) {
        vars['$L.running'] = true;
        vars["$feature.build.release.start"] = sch.times[0];
        vars["$feature.build.release.end"] = sch.times[1];
        vars["$feature.build.release.repeat"] = sch.repeat;
        vars['$L.status'] = system.functions.scmsg("scheduleStatus2", "featuretracker", [sch.expiration]);
    }
}

function createScheduler(releaseID) {
    var schedule = new SCFile("schedule");
    schedule._class = "problem";
    schedule.expiration = vars["$feature.build.release.start"];
    schedule.name = "Feature Tracker - Build Release: " + releaseID;

    schedule.times[0] = vars["$feature.build.release.start"];
    schedule.times[1] = vars["$feature.build.release.end"];
    schedule.repeat = vars["$feature.build.release.repeat"];

    var id = lib.StringUtil.escapeAllStr(releaseID);
    schedule.javascript = "lib.FeatureTracker.buildRelease(\"" + id + "\", true);lib.FeatureTracker.stopScheduler(\"" + id + "\", true)";
    var rc = schedule.doInsert();
}

function deleteScheduler(releaseId, scheduled) {
    var schedule = getSchedule(releaseId);
    if (null != schedule) {
        schedule.doDelete();
    }
}

function stopScheduler(releaseId, scheduled) {
    var schedule = getSchedule(releaseId);
    if (null != schedule) {
        var a = addInterval(system.functions.tod(), system.functions.val(schedule.repeat, 3));
        var b = system.functions.val(schedule.times[1], 3);
        if (!a || !b || a.getTime() >= b.getTime()) {
            var rcDEL = schedule.doDelete();
            if (rcDEL == RC_SUCCESS) {
                return true;
            }
        }
    }

    return false;
}


function addInterval(date, interval) {
    var ZERO = system.functions.val("00:00:00", 3);
    return new Date(interval.getTime() - ZERO.getTime() + date.getTime());
}

/**
 * This function checks of you have the capability word to use certain functions
 * 
 * @param  {String} releaseID 
 * @return {boolean} true, schedule record deleted 
 */
function security(type) {
    var access = false;
    if (type == "feature" && system.functions.index("FeatureTrackerAccess", vars.$lo_ucapex) > 0) {
        access = true;
    }

    if (system.functions.index("FeatureTrackerReleaseManager", vars.$lo_ucapex) > 0) {
        access = true;
    }

    return access;
}

/**
 * This function is called when the release Number is changed within a feature and updates the related objects with the new release ID
 * 
 * @param  {String} featureID 
 * @return {boolean} true, schedule record deleted 
 */
function changeRelease(featureID, newreleaseID) {
    var query = 'feature="' + featureID + '"';
    var watchdog = new SCFile("watchdog");
    var rc = watchdog.doSelect(query);

    if (rc == RC_SUCCESS) {
        do {
            //cleanup release array
            var numberReleases = system.functions.lng(system.functions.denull(watchdog.release));
            watchdog.release = system.functions._delete(watchdog.release, 1, numberReleases);

            // get release IDs from features
            var a;
            var l = system.functions.lng(system.functions.denull(watchdog.feature));
            for (a = 0; a < l; a++) {
                var ft = new SCFile("featuretracker", SCFILE_READONLY);
                ft.setFields(["id", "release"]);
                query = "id=\"" + watchdog.feature[a] + "\"";
                var rc2 = ft.doSelect(query);
                if (rc2 == RC_SUCCESS) {
                    var releaseID = ft.release;
                    if (featureID == ft.id) {
                        releaseID = newreleaseID;
                    }
                    var indexRelease = system.functions.index(releaseID, watchdog.release);
                    if (indexRelease == 0) {
                        watchdog.release = system.functions.insert(watchdog.release, 0, 1, releaseID);
                    }
                }
            }
            var rcSave = watchdog.doUpdate();
            var rcNext = watchdog.getNext();
        } while (rcNext == RC_SUCCESS);
    }
}


// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function addPath(parent, child) {
    if (!parent) {
        var msg = funcs.scmsg("addPath", "featuretracker", [parent]);
        printMessage(msg, 1);
        return child;
    }
    var last = parent.charAt(parent.length - 1);
    if (last != '/' && last != '\\') {
        parent = parent + '/';
    }
    var full = parent + child;
    if (isUnix()) {
        full = full.replace(/\\/g, '/');
    } else {
        full = full.replace(/\//g, '\\');
    }

    return full;
}

function mkdir(base, folder) {
    var full = addPath(base, folder);
    return doMkdir(full);
}

var is_unix = null;

function isUnix() {
    if (is_unix === null) {
        var os = system.functions.version()[0];
        if (os.indexOf('unix') >= 0) {
            is_unix = true;
        } else {
            is_unix = false;
        }
    }

    return is_unix;
}

function isWin() {
    return !isUnix();
}

function doMkdir(full) {
    var res = null;
    var path = '"' + full + '"';
    if (isUnix()) {
        res = sysExec('mkdir -p ' + path);
    } else {
        res = sysExec('mkdir ' + path);
    }

    //return res[1]==0;

    return full;
}


function copyFile(from, to) {
    var copy = isUnix() ? 'cp' : 'copy';
    var cmd = copy + ' "' + from + '" ' + ' "' + to + '"';
    sysExec(cmd);
}

function commitCode(id) {
    var sql = 'feature="' + id + '" and status ~="closed"';
    var count = lib.c.$('!watchdog').count(sql, id);
    var msg = null;
    if (count == 0) {
        msg = funcs.scmsg("No item needs to commit", "featuretracker");
        printMessage(msg, 1);
        return;
    } else {
        msg = funcs.scmsg("Commit", "featuretracker", [count]);
        printMessage(msg, 1);
    }
    sql = 'feature=:0 and status ="new"';
    var list = [];
    lib.c.$('!watchdog').fields(['path', 'flags.file']).find(sql, id).each(function(item) {
        list.push({
            flag: item['flags.file'],
            path: item.path
        });
    });
    var item = lib.c.$('featuretracker').fields(['id', 'title']).find('id=:0 ', id).one();
    msg = item.id + item.title;
    lib.DevOpsBase.commitList(list, id, msg);
}


function dateTag() {
    var date = new XMLDate(new Date());
    return date.getISODateTimeString().replace(/[-T:]|(\+.*)$|Z/g, '');
}


function getPushRemoteMessage(release) {
    var data = rteJSONParse(release.data);
    var last = data[data.length - 1];

    var endPoint = lib.FeatureSettings.getGlobalSettings().remoteSM;
    var msg = funcs.scmsg("Deploy Release", "featuretracker") + "\n" + funcs.scmsg("repository", "featuretracker") + ": " + last.url;
    if (last.tag) {
        msg += '\nTag: ' + last.tag;
    }
    msg += '\nSM: ' + endPoint;

    return msg;
}

function canPushToRemote(release) {
    if (release.type != 'release') {
        return false;
    }

    if (!_.contains(vars["$lo.ucapex"], "FeatureTrackerReleaseManager")) {
        return false;
    }

    if (!release.data) {
        return false;
    }

    if (!release.active) {
        return false;
    }

    return true;
}

function validatePushToRemote(release) {
    var INVALID = 1;
    var VALID = 0;
    var msg = null;
    var settings = lib.FeatureSettings.getGlobalSettings();

    if (!settings.remoteSM) {
        msg = funcs.scmsg("validate_1", "featuretracker");
        printMessage(msg, 2);
        return INVALID;
    }

    if (!settings.remoteUserName) {
        msg = funcs.scmsg("validate_2", "featuretracker");
        printMessage(msg, 2);
        return INVALID;
    }

    if (!release.data) {
        msg = funcs.scmsg("validate_3", "featuretracker");
        printMessage(msg, 2);
        return INVALID;
    }
    return 0;
}

function pushToRemote(release) {
    if (!canPushToRemote(release)) {
        return;
    }

    var data = release.data;

    var settings = lib.FeatureSettings.getGlobalSettings();

    data = rteJSONParse(data);
    var last = data[data.length - 1];

    var url = settings.remoteSM + '/SM/9/rest/base/applyPatch';

    if (!settings.remotePassword) {
        settings.remotePassword = '';
    }

    var value = "Basic " + lib.smis_CommonLib.encode64(settings.remoteUserName + ":" + settings.remotePassword);
    var lan = vars['$G.my.language'];

    var headers = [];
    headers.push(new Header('Content-Type', 'application/json;charset=UTF-8'));
    headers.push(new Header('Authorization', value));
    headers.push(new Header('Accept-Language', lan));

    var returnList = [];

    if (last.type == 'svn') {
        last.svnUserName = lib.FeatureSettings.getSettings().userName;
        last.svnPassword = lib.FeatureSettings.getSettings().password;
    }
    var body = rteJSONStringify({
        data: last
    });

    try {
        var response = doHTTPRequest('POST', url, headers, body, 0, 0, 0, returnList);

        var json = rteJSONParse(response);
        var msg = null;
        if (json.ReturnCode == 0) {
            vars.$featureAction = "deploySuccess";
            vars.$actionDescription = "Succeeded to deploy " + last.tag + "  to the remote Service Manager server " + settings.remoteSM;
            msg = funcs.scmsg("Push completed", "featuretracker");
            printMessage(msg, 1);
        } else {
            vars.$featureAction = "deployFailed";
            vars.$actionDescription = "Failed to deploy " + last.tag + " to the remote Service Manager server " + settings.remoteSM + "\n" + json.Messages;
            msg = funcs.scmsg("Push failed", "featuretracker") + "\n" + json.Messages;
            printMessage(msg, 2);
        }
    } catch (e) {
        vars.$featureAction = "deployFailed";
        vars.$actionDescription = "Failed to deploy " + last.tag + " to the remote Service Manager server " + settings.remoteSM + "\n" + e.toString();
        msg = funcs.scmsg("Push failed with exception", "featuretracker") + "\n" + e.toString();
        printMessage(msg, 2);
    }
    lib.ActivityLog.createActivityLog(vars.$L_file, vars.$L_file_save, "build");
    vars.$featureAction = null;
    vars.$actionDescription = null;
}

function getSvnSourceCodeUrl() {
    var settings = lib.FeatureSettings.getSettings();
    var cmd = "svn info --non-interactive --username \"" + settings.userName + "\" --password \"" + settings.password + "\" \"" + getRTEParm('svc_rootdir') + "\" --show-item=url   --no-newline";
    var url = _.trim(sysExec(cmd)[2]);
    return url;
}

function printMessage(msg, level) {
    funcs.rtecall("msg", new SCDatum(), msg, level);
}