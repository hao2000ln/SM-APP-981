var SVC_ROOT = getRTEParm('svc_rootdir');
var _ = lib.Underscore.require();

function POST(req, res) {
    var data = req.body.data;

    var folder = addFolder(SVC_ROOT,"tempFolder");

    var toFolder = null;
    try {
        toFolder = cloneRelease(folder, data);
        importRelease(toFolder);
    } catch (e) {
        res.status(200).send({
            "ReturnCode": 1,
            "Messages": [e]
        });
        deleteFolder(folder);
        return;
    }

    deleteFolder(folder);

    res.status(200).send({
        "ReturnCode": 0,
        "Messages": 'success'
    });
}

function cloneRelease(folder, data) {
    if (isGit(data.type)) {
        return cloneGitRelease(folder, data);
    } else {
        return cloneSvnRelease(folder, data);
    }
}

function cloneGitRelease(folder, data) {
    var repo = data.url;
    var tag = data.tag;
    var to = addFolder(folder, tag);
    makeDir(to);

    // to = to.replace(/\\/g, '\\\\');
    var cmd = 'git clone --depth 1 -b "' + tag + '" "' + repo + '" "' + to + '"';
    var res = runCommand(cmd);
    if (res[1] != 0) {
        throw "Error to clone git release. cmd:\n\t" + cmd;
    }
    
    return to;
}

function importRelease(folder) {
    var to = addFolder(folder, 'data');
    var cmd = 'sm -svc_import -svc_rootdir:"' + to + '" -svc_mode:99 -svc_cleanbuild:1';
    if(needUpdateDbdict(to)){
        cmd += ' -svc_updatedbdict';
    }
    if(isUnix()){
        cmd = './' + cmd;
    }
    var res = runCommand(cmd);
    if (res[1] != 0) {
        // throw "Error to import the release. cmd:" + cmd;
        throw "Error with sm -svc_import";
    }
    return to;
}

function needUpdateDbdict(to){
    var path = addFolder(to,"dbdict");
    return funcs.isfileexist(path);
}

function getSvnTagByUrl(url) {
    var list = url.split('/');
    // http://16.186.74.235/svn/repos/sm1/trunk/R2018.2_20180117060052/
    return list[list.length-2];
}


function cloneSvnRelease(folder, data) {
    var SVN = 'svn ';
    if(data.svnUserName) {
        SVN +='--username "'+data.svnUserName+'" ';
    }
    
    if(data.svnPassword) {
        SVN +='--password "'+data.svnPassword+'" ';
    }
    
    var list = data.url.split('/');
    var to = addFolder(folder, getSvnTagByUrl(data.url));
    deleteFolder(to);
    
    var cmd = SVN + 'export "' + data.url + '" "' + to + '"';
    
    var res = runCommand(cmd);
    if (res[1] != 0) {
        throw "Error to export svn release. cmd:\n\t" + data.url;
    }
    
    return to;
}

function addFolder(parent, child) {
    var sepChar = '\\';

    if (isUnix()) {
        sepChar = '/';
    }

    if (parent.length > 0 && parent.charAt(parent.length - 1) == sepChar) {
        return parent + child;
    }

    return parent + sepChar + child;
}

function deleteFolder(folder) {
    if (isUnix()) {
        if(folder && folder !="/*"){
            runCommand('rm -fr "' + folder + '"');
        }
    } else {
        runCommand('rd /s /q "' + folder + '"');
    }
}

function mkdir(folder) {
    if (isUnix()) {
        runCommand('mkdir -p "' + folder + '"');
    } else {
        runCommand('mkdir "' + folder + '"');
    }
}

function getSMRunFolder() {
    if (isUnix()) {
        return runCommand('pwd')[2];
    } else {
        return runCommand('cd')[2];
    }
}

function runCommand(cmd) {
    return sysExec(cmd);
}

var __isUnix = null;
function isUnix() {
    if (__isUnix === null) {
        __isUnix = system.functions.version()[0].toLowerCase().indexOf('unix') > -1;
    }

    return __isUnix;
}

function isGit(type) {
    return 'git' == type;
}

function authorize() {
    if(_.contains(vars["$lo.ucapex"], "SysAdmin")) {
        return true;
    }
    
    return false;
}

