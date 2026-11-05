var log = getLog('devops.git');

var _ = lib.Underscore.require();
var $ = lib.c.$;
var trim = $.trim;
var endsWith = $.endsWith;
var startsWith = $.startsWith;
var SVC_ROOT = getRTEParm('svc_rootdir');

var GIT = 'git -C "' + SVC_ROOT + '" ';

var GIT_NEW = 0;
var GIT_ADD = 1;
var GIT_UPDATE = 2;
var GIT_DELETE = 3;
var STATUS_NEW = 'new';
var STATUS_COMMITTED = 'committed';
var STATUS_CLOSED = 'closed';
var watchList = lib.FeatureSettings.getGlobalSettings().watchedTables;
var JSON = {
    "toJson": rteJSONStringify,
    "parse": rteJSONParse
};

function getAuthor() {
    var userName = vars.$lo_operator['name'];
    var email = vars.$lo_operator['email'];
    return userName + '<' + email + '>';
}

function run() {
    status();
}

function runCommand(cmd) {
    var res = sysExec(cmd);
    if (res[1] != 0) {
        var msg = funcs.scmsg("Command failed", "featuretracker", [cmd]);
        lib.FeatureTracker.printMessage(msg, 2);
    }
    return res;
}

/**
 * Run git status command and call function 'func' to process the status result
 * @param func function to process result
 */
function status(func) {
    if (!func) {
        func = addToWatchdog;
    }
    // var cmd = 'git help add "' + SVC_ROOT + '" ';
    var cmd = GIT + 'status';
    var res = runCommand(cmd);
    var text = res[2];

    var lines = text.split("\n");

    var path = null;
    var k;
    for (k = 0; k < lines.length; k++) {
        var line = lines[k];
        if (startsWith(line, "#")) {
            line = line.substring(1);
        }

        line = trim(line);

        if (isFileLine(line)) {
            var obj = parseLine(line);
            if (obj.path.indexOf('userinfo') != 0) {
                func(obj.path, obj.status);
            }
        } else if (isFolderLine(line)) {
            func(trim(line), GIT_NEW, true);
        }
    }
}

/**
 * parse the line by status: add/update/deltete
 * @param line 
 */
function parseLine(line) {
    var PREFIX_ADD = 'new file:';
    var PREFIX_UPDATE = 'modified:';
    var PREFIX_DELETE = 'deleted:';
    var PREFIX_RENAME = 'renamed:';

    var LEN_PREFIX_ADD = PREFIX_ADD.length;
    var LEN_PREFIX_UPDATE = PREFIX_UPDATE.length;
    var LEN_PREFIX_DELETE = PREFIX_DELETE.length;

    var path = line;
    var statusGit = null;

    line = trim(line);
    if (startsWith(line, PREFIX_ADD)) {
        path = line.substring(LEN_PREFIX_ADD);
        statusGit = GIT_ADD;
    } else if (startsWith(line, PREFIX_UPDATE)) {
        path = line.substring(LEN_PREFIX_UPDATE);
        statusGit = GIT_UPDATE;
    } else if (startsWith(line, PREFIX_RENAME)) {
        var from = line.lastIndexOf('->');
        path = line.substring(from + 2);
        statusGit = GIT_UPDATE;
    } else if (startsWith(line, PREFIX_DELETE)) {
        path = line.substring(LEN_PREFIX_DELETE);
        statusGit = GIT_DELETE;
    } else {
        // func(line, GIT_ADD);
        statusGit = GIT_NEW;
    }

    return {
        "path": trim(path),
        "status": statusGit
    };
}


function addFolderToWatchdog(path) {
    var tableName = path.split('/')[0];
    if (watchList && watchList.length > 0) {
        if (!_.contains(watchList, tableName)) {
            return;
        }
    }

    var cmd = GIT + 'add "' + path + '"';
    var res = runCommand(cmd);
    cmd = GIT + 'status "' + path + '"';
    res = runCommand(cmd);

    var text = res[2];

    var lines = text.split("\n");
    var k;
    for (k = 0; k < lines.length; k++) {
        var line = lines[k];
        if (startsWith(line, "#")) {
            line = line.substring(1);
        }

        line = trim(line);

        if (isFileLine(line)) {
            var obj = parseLine(line);
            if (obj.path.indexOf('userinfo') != 0) {
                addToWatchdog(obj.path, obj.status);
            }
        } else if (isFolderLine(line)) {
            addToWatchdog(trim(line), obj.status, true);
        }
    }
    cmd = GIT + 'reset "' + path + '"';
    res = runCommand(cmd);

}

function addToWatchdog(path, status, isFolder) {
    if (isFolder) {
        addFolderToWatchdog(path);
        return;
    }
    var LEN_SUFIX_XML = '.xml'.length;

    var list = path.split('/');
    var tableName = list[0];

    if (watchList && watchList.length > 0) {
        if (!_.contains(watchList, tableName)) {
            return;
        }
    }
    var filename = list[list.length - 1];
    filename = filename.substring(0, filename.length - LEN_SUFIX_XML);
    var keyList = rteJSONParse(getRecordKey(filename));
    var tag = tableName + ';' + keyList.join(';');
    var query = lib.DBUtils.getQueryByTag(tag);

    var file = $(tableName, SCFILE_READONLY).fields(["sysmodtime", "sysmoduser"]).find(query).one();
    var modtime;
    if (file != null) {
        if (funcs.val(file.sysmodtime, 3) == null) {
            modtime = new Date(file.sysmodtime);
        } else {
            modtime = file.sysmodtime;
        }
    } else {
        modtime = funcs.tod();
    }

    var tod = funcs.tod();
    var f = $('!watchdog').fields(["modified"]).find('status=:0 and path=:1', STATUS_NEW, path).one();
    if (f != null) {
        if (file != null) {
            if (new Date(f.modified).getTime() < new Date(modtime).getTime()) {
                f = $('!watchdog', true).find('status=:0 and path=:1', STATUS_NEW, path).one();
                f.user = file.sysmoduser;
                f.modified = modtime;
                f.doUpdate();
            }
        } else {
            f.user = '<delete>';
            f.doUpdate();
        }
    } else {
        f = new SCFile("watchdog");
        f.table = tableName;
        f.tag = tag;
        if (file != null) {
            f.user = file.sysmoduser;
        } else {
            f.user = '<delete>';
        }
        f.modified = modtime;
        f.flags_file = flag(status);
        f.path = path;
        f.status = STATUS_NEW;
        f.doInsert();
    }
}

function flag(mod) {
    if (GIT_ADD == mod) {
        return 'A';
    } else if (GIT_UPDATE == mod) {
        return 'U';
    } else if (GIT_DELETE == mod) {
        return 'D';
    } else if (GIT_NEW == mod) {
        return '?';
    }
}

function getVersion(version) {
    var cmd = GIT + ' log -n 1 ' + version;
    var res = runCommand(cmd);

    var content = res[2];

    var begin = content.indexOf(' ');
    var end = content.indexOf('\n');

    return content.substring(begin + 1, end);
}

function getComments(lines) {
    var str = '';
    if (lines) {
        lines = lines.split('\n');
        var k;
        for (k = 0; k < lines.length; k++) {
            var line = trim(lines[k]);

            if (line == '') {
                continue;
            }

            line = line.replace('"', '');
            str = str + ' -m "' + line + '"';
        }
    }

    if (str == '') {
        str = ' -m "no message"';
    }

    return str;
}

function quot(path) {
    return '"' + path + '"';
}

function isFolderLine(line) {
    return endsWith(line, '/');
}


function isFileLine(line) {
    return endsWith(line, '.xml');
}

function selectConflict() {

}

function getLastVersionInfo(svnversion) {
    if (log.isTraceEnabled()) {
        log.trace('entering getLastVersionInfo');
    }

    var cmd = GIT + ' branch -vv';
    var res = runCommand(cmd);
    try {
        return res[2];
    } catch (e) {
        return e;
    }
}

function commitList(list, id, msg) {
    // git reset    
    var cmd = GIT + ' reset ';
    var res = runCommand(cmd);
    //git commit
    var length = list.length;
    if (length > 0) {
        var k;
        for (k = 0; k < length; k++) {
            var item = list[k];
            var path = '"' + item.path + '"';
            if (item.flag == 'D') {
                cmd = GIT + ' rm ' + path;
                res = runCommand(cmd)[2];
            } else {
                cmd = GIT + ' add ' + path;
                res = runCommand(cmd)[2];
            }
        }
        var comments = getComments(msg);
        cmd = GIT + ' commit ' + comments + ' --author "' + getAuthor() + '"';
        res = runCommand(cmd);

        if (res[1] == 0) {
            var tod = funcs.tod();
            var content = res[2];
            var begin = content.indexOf('[');
            var end = content.indexOf(']');
            var begin2 = content.indexOf(' ', begin + 1);
            var version = content.substring(begin2 + 1, end);
            version = getVersion(version);
            var sql = 'feature=:0 and status ="new"';
            $('!watchdog', true).find(sql, id).each(function(item) {
                item['commit.time'] = tod;
                item['commit.by'] = getAuthor();
                item['commit.revision'] = version;
                item['status'] = STATUS_COMMITTED;
                item.doUpdate();
            });
        }
    }
    //push
    cmd = GIT + ' push';
    var ret = runCommand(cmd);
    if (ret[1] == 0) {
        sql = 'feature=:0 and status ~="closed"';
        $('!watchdog', true).find(sql, id).each(function(item) {
            item['status'] = STATUS_CLOSED;
            item.doUpdate();
        });
    }
}

function getFileInfo(path) {
    var LEN_SUFIX_XML = '.xml'.length;

    var list = path.split('/');
    var tableName = list[0];

    var filename = list[list.length - 1];
    filename = filename.substring(0, filename.length - LEN_SUFIX_XML);

    var list2 = filename.split('--');
    var name = list2[0];
    var code = list2[1];

    var keyList = name.split('-');

    if (code) {
        var func = unescapeName(code);
        var k;
        for (k = 0; k < keyList.length; k++) {
            keyList[k] = keyList[k].replace(/_/g, func);
        }
    }

    var tag = tableName + ';' + keyList.join(';');

    return {
        "name": tableName,
        "tag": tag
    };
}

function findWatchdog(line, status) {
    var item = parseLine(line);

    var watchdog = $('!watchdog', true).find('status=:0 and path=:1', status, item.path).one();
    if (watchdog != null) {
        return watchdog;
    }
    var fileInfo = getFileInfo(item.path);
    var query = lib.DBUtils.getQueryByTag(fileInfo.tag);
    var file = $(fileInfo.name, true).select(query).one();
    var modtime;
    if (file != null) {
        if (funcs.val(file.sysmodtime, 3) == null) {
            modtime = new Date(file.sysmodtime);
        } else {
            modtime = file.sysmodtime;
        }
    } else {
        modtime = funcs.tod();
    }

    var tod = funcs.tod();
    watchdog = new SCFile("watchdog");
    watchdog.table = fileInfo.name;
    watchdog.tag = fileInfo.tag;

    if (file != null) {
        watchdog.user = file.sysmoduser;
    } else {
        watchdog.user = 'delete';
    }

    watchdog.modified = modtime;
    watchdog.flags_file = flag(item.status);
    watchdog.path = item.path;
    watchdog.status = STATUS_NEW;
    watchdog.doInsert();

    return watchdog;
}

function InfoTemplateData(file) {
    if (log.isTraceEnabled()) {
        log.trace('entering TemplateData');
    }
    var jsondata = {
        viewData: {
            isWeb: lib.BaseUtil.isWebClient()
        },
        records: []
    };

    var info = getInfo();

    jsondata.revisions = info.revisions;
    jsondata.contributions = info.contributions;
    jsondata.branch = info.branch;
    jsondata.remote = info.remote;
    jsondata.lastCommit = info.lastCommit;

    jsondata.toString = function() {
        return JSON.stringify(this);
    };

    return jsondata;
}


function getInfo() {
    var json = {};

    json.revisions = getRevisions();
    json.contributions = getContributions();
    json.branch = getBranch();
    json.remote = getRemote(json.branch);
    json.lastCommit = getLastCommit();

    return json;
}

function getBranch() {
    var cmd = GIT + 'branch -vv';
    var res = runCommand(cmd);
    var list1 = trim(res[2]).split('\n');

    var activeLine = list1[0];

    var branchCount = list1.length;
    var k;
    for (k = 0; k < list1.length; k++) {
        var line = list1[k];
        if (startsWith(line, '*')) {
            activeLine = line;
            break;
        }
    }


    var index = activeLine.indexOf(']');
    activeLine = activeLine.substring(2, index + 1);
    return activeLine;
}

function getRemote(activeLine) {
    if (activeLine) {
        var index1 = activeLine.indexOf('[');
        var index2 = activeLine.indexOf(']');
        var remote = activeLine.substring(index1 + 1, index2);

        var index3 = remote.indexOf(':');

        if (index3 > 0) {
            remote = remote.substring(0, index3);
        }

        var upstream = remote.split('/')[0];

        var cmd = GIT + 'remote get-url ' + upstream;
        var res = runCommand(cmd);
        var url = trim(res[2]);

        return remote + ':' + url;
    }
    return activeLine;
}

function getRevisions() {
    var cmd = GIT + 'rev-list --all --count';
    var res = runCommand(cmd);
    return trim(res[2]);
}

function getContributions() {
    var cmd = GIT + 'shortlog -sn';
    var res = runCommand(cmd);
    var list = trim(res[2]).split('\n');
    return list.length;
}

function getLastCommit() {
    var cmd = GIT + 'log -n 1';
    var res = runCommand(cmd);
    var list1 = trim(res[2]).split('\n');

    var fieldValue = function(str) {
        var index = str.indexOf(':');
        var ret = trim(str.substring(index + 1));
        return ret;
    };

    var vv = function(str) {
        var index = str.indexOf(' ');
        return trim(str.substring(index + 1));
    };

    return {
        revision: vv(list1[0]),
        auther: fieldValue(list1[1]),
        date: fieldValue(list1[2])
    };
}