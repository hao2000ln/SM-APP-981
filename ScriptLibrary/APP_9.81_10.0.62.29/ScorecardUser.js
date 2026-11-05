var JSON = {
    "stringify": rteJSONStringify,
    "parse": rteJSONParse
};
var toJSON = lib.JSON2.toJSON;
var common = lib.ScorecardCommon;
function printMsg(msg) {
    print(msg);
}

function SC_searchUserList(host,pid,lic,dev,user)
{
    var tarLic = "*";
    var tarDev = "*";
    var licType = [funcs.scmsg("namedLic", 'ScoreCard'), funcs.scmsg("floatingLic", 'ScoreCard'), funcs.scmsg("unLimitedLic", 'ScoreCard')];
    var clientType = ["Webtier-Index", "Webtier-ESS", "Win-Client", "SMA-SP", "Mobile-STD", "Mobile-ESS", "Other"];
    var len = licType.length;
    
    if (lic != "*"){
        for(var i = 0; i < len; i++){
            if (licType[i] == lic){
                tarLic = i;
                break;
            }
        }
    }
    if (dev != "*"){
        var len = clientType.length;
        for(var i = 0; i < len; i++){
            if (clientType[i] == dev){
                tarDev = i;
                break;
            }
        }
    }
    var count = searchUserList(host,pid,tarDev,tarLic,user);
    return count;
}
function SC_createUserList(varName_count,varName_searchHosts,varName_userPids)
{
    var count = vars[ varName_count ];
    var hosts = vars[ varName_searchHosts ];
    var pids = vars[ varName_userPids ];
    var ret = createUserList();
    var len = ret.length;
    hosts.push("*");
    pids.push("*");
    if (len > 2){
        count = parseInt(ret[0]);
        for(var i = 2; i < len; i++){
            var hsList = ret[i].split(';');
            hosts.push(hsList[0]);
            pids.push(ret[i]);
        }
        vars[ trimVarName( varName_count ) ] = count;
        vars[ trimVarName( varName_searchHosts ) ] = hosts;
        vars[ trimVarName( varName_userPids ) ] = pids;
    }
}

function SC_getUserList(start, count)
{
    var f = getUserList(start,count);
    var login = vars["$L.login.array"];

    var user = vars["$L.user.array"];
    var pid = vars["$L.pid.array"];
    var tid = vars["$L.tid.array"];
    var device = vars["$L.device.array"];
    var idle = vars["$L.idle.array"];
    var session = vars["$L.session.array"];
    var hostip = vars["$L.hostip.array"];
    var host = vars["$L.host.array"];
    var lictype = vars["$L.lictype.array"];
    var clientip = vars["$L.clientip.array"];
    var len = f.length;
    for(var i = 1; i < len; i++){
        var list = f[i].split(';');
        if (list.length == 11){
            login.push(list[0]);
            session.push(list[1]);
            device.push(list[2]);
            user.push(list[3]);
            idle.push(list[4]);
            pid.push(list[5]);
            tid.push(list[6]);
            host.push(list[7]);
            hostip.push(list[8]);
            if (list[9]>0 && list[9] < 4)
                lictype.push(convLicType(list[9]));
            else
                lictype.push("");
            clientip.push(list[10]);
        }
    }
    
    vars[ trimVarName( "$L.login.array" ) ] = login;
    vars[ trimVarName( "$L.user.array" ) ] = user;
    vars[ trimVarName( "$L.pid.array" ) ] = pid;
    vars[ trimVarName( "$L.tid.array" ) ] = tid;
    vars[ trimVarName( "$L.device.array" ) ] = device;
    vars[ trimVarName( "$L.idle.array" ) ] = idle;
    vars[ trimVarName( "$L.session.array" ) ] = session;
    vars[ trimVarName( "$L.hostip.array" ) ] = hostip;
    vars[ trimVarName( "$L.host.array" ) ] = host;
    vars[ trimVarName( "$L.lictype.array" ) ] = lictype;
    vars[ trimVarName( "$L.clientip.array" ) ] = clientip;
}
function prePagesProcess(varName_start,varName_count,varName_total,varName_totalPages,varName_itemsPerPage,varName_curPage,varName_stepWard)
{
    var start = vars[ varName_start ];
    var end = 0;
    var count = vars[varName_count];
    var total = vars[varName_total];
    var totalPages = vars[varName_totalPages];
    var itemsPerPage = vars[varName_itemsPerPage];
    var curPage = vars[varName_curPage];
    var stepWard = vars[varName_stepWard];
    totalPages = Math.floor(total / itemsPerPage) + 1;
    if (parseInt(curPage) > totalPages)
        curPage = totalPages;
    if (stepWard == 'next') {
        if (curPage < totalPages) curPage++;
    }

    if (stepWard == 'previous') {
        if (curPage > 1) curPage--;
    }
    if (curPage == 0)
        curPage = 1;
    start = (curPage-1)*itemsPerPage;
    if (start > total) start = total;
    end = curPage*itemsPerPage;
    if (end > total) end = total;
    var count = end - start;
    vars[ trimVarName( varName_curPage ) ] = curPage;
    vars[ trimVarName( varName_totalPages ) ] = totalPages;
    vars[ trimVarName( varName_stepWard ) ] = "";     
    vars[ trimVarName( varName_start ) ] = start;
    vars[ trimVarName( varName_count ) ] = count; 
}

function trimVarName( name ) {
    return name.replace( /\./g, '_' );
}

function convLicType(type)
{
    var cap = "";
    if (type == 1)
        cap = "Named";
    else if (type == 2)
        cap = "Floating";
    else if (type == 3)
        cap = "Self Service Ticketing"
    
    return cap;
}

function getPageUserinfo(varName_uid,varName_lictype,varName_clientip)
{
    var uidArr = vars[ varName_uid ];
    var lictype = vars[ varName_lictype ];
    var clientip = vars[ varName_clientip ];
    var len = uidArr.length();
    var f = new SCFile("userinfo"); 
    var query = "";
    var rc = 0;
    
    for(var i = 0; i < len; i++)
    {
        query = "uid=\""+uidArr[i]+"\""; 
        rc = f.doSelect(query); 
         
        if (rc == RC_SUCCESS)
        {
            clientip.push(f["clientip"]);
            lictype.push(convLicType(f["logintype"]));
        }
        else
        {
            lictype.push("");
            clientip.push("");
        }
    }
    vars[ trimVarName( varName_lictype ) ] = lictype;
    vars[ trimVarName( varName_clientip ) ] = clientip;
}

function buildUserSearchHostList(host)
{
    var searchHost = [];
    for(var len = host.length();len>0;len--)
    {
        var item = host[len-1].split('.');
        searchHost.push(item[0]);
    }
    return searchHost;
}

function buildUserSearchPidList(curHost, hostValue, varName_searchPid,pidsData)
{
    var searchPid = vars[ varName_searchPid ];
    var len = hostValue.length();
    searchPid.push("*");
    for(var i = 1; i < len; i++)
    {
        if (curHost == hostValue[i]){
            var list = pidsData[i].split(';');
            var vlen = list.length;
            if (vlen>0 && list[0] == curHost){
                for(var j = 1; j < vlen; j++)
                    searchPid.push(list[j]);
            }
        }
    }
    vars[ trimVarName( varName_searchPid ) ] = searchPid;
}


function parseUser2Json(user)
{
    var userJson = {
        "userName":"",
        "processId":0,
        "deviceId":"",
        "loginTime":"",
        "idleTime":"",
        "TID":0,
        "sessionId":0,
        "hostName":"",
        "hostIP":"0",
        "clientIP":"",
        "licType":""
    };
    var list = user.split(';');
    if (list.length == 11){
        userJson["loginTime"] = list[0];
        userJson["sessionId"] = list[1];
        userJson["deviceId"] = list[2];
        userJson["userName"] = list[3];
        userJson["idleTime"] = list[4];
        userJson["processId"] = list[5];
        userJson["TID"] = list[6];
        userJson["hostName"] = list[7];
        userJson["hostIP"] = list[8];
        userJson["licType"] = convLicType(list[9]);
        userJson["clientIP"] = list[10];
        return userJson;
    }
    else
        return null;
}


function hostsList2Json(hostList)
{
    var Hosts = {
        "name":"",
        "pids":[]
    };
    var hsList = hostList.split(';');
    var size = hsList.length;
    Hosts["name"] = hsList[0];
    for(var i = 1; i < size; i++)
        Hosts["pids"].push(parseInt(hsList[i]));
    
    return Hosts;
}

function device2Json(device, trans)
{
    var DeviceJson = [
    ];
    
    var list = device.split(';');
    var size = list.length;
    for(var i = 0; i < size; i++){
        var sublist = list[i].split(':');
        if (sublist.length == 2){
            var item = {
                "clientType":"",
                "userCount":0
            };
            item["clientType"] = sublist[0];
            item["userCount"] = parseInt(sublist[1]);
            DeviceJson.push(item);
        }
    }

    return DeviceJson;
}


function killUser() {
    var sessionID = 0;
    var cmd = vars["$L.cmd.array"];
    var session = vars["$L.session.array"];
    var pid = vars["$L.pid.array"];
    var host = vars["$L.host.array"];
    var len = cmd.length();

    var msg = "";
    var err = funcs.scmsg(965, 'us');
    var frc = new SCDatum();
    try {
        for (var i = 0; i < len; i++) {
            if (cmd[i] == 'k' || cmd[i] == 'K') {
                var ret = lib.ScorecardService.scKillUser(parseInt(session[i]), host[i], pid[i]);
                cmd[i] = "";
                if (ret[0] == 0) {
                    msg = funcs.scmsg(966, 'us', [sessionID]);
                    funcs.rtecall("msg", frc, msg, 1);
                } else
                    funcs.rtecall("msg", frc, err, 3);
            }
        }
        vars[trimVarName("$L.cmd.array")] = cmd;
    } catch (e) {
        funcs.rtecall("msg", rc, err, 3);
    }
}
function buildUserHeader(arrCap,arrLen) {
    var str = "";
    var len = arrCap.length;
    for(var i = 0; i < len; i++)
    	str += common.packageElements(funcs.scmsg(arrCap[i], 'ScoreCard'), arrLen[i]);
    return str;
}
function buildUserInformation()
{
    var file = "";
    var arrLen = [20,15,20,20,15,15,15,20,15,15,30];
    var maxLen = 0;
    var sz = arrLen.length;
    for(var i = 0; i < sz; i++)
    	maxLen += arrLen[i];
    var overview = "";
    overview += common.buildMidDivider('-', funcs.scmsg("report", 'ScoreCard', [funcs.scmsg("userInfo", 'ScoreCard')]), maxLen) + '\n';
    overview += funcs.scmsg("reportTime", 'ScoreCard') + ': ' + funcs.tod() + "\n";
    overview += common.buildHorizontalDivider('-', maxLen) + '\n';
    
    file += overview;
    
    var arrCap = [
        "userName",
        "processId",
        "deviceId",
        "loginTime",
        "idleTime",
        "TID",
        "sessionId",
        "hostName",
        "hostIP",
        "clientIP",
        "licType"
    ];
    file += buildUserHeader(arrCap,arrLen)+"\n";
    file += common.buildHorizontalDivider_N("-",maxLen)+"\n";
    var order = [3,5,2,0,4,6,1,7,8,10,9];
    var f = getUserList(0, 1);
    var total = f[0];
    if (total > 0){
        f = getUserList(0, total);
        var size = f.length;
        for (var i = 1; i < size; i++) {
            var list = f[i].split(';');
            var user = "";
            for(var j = 0; j < 10; j++)
            	user += common.packageElements(list[order[j]], arrLen[j]);
            user += common.packageElements(convLicType(list[order[j]]), arrLen[j]);
            file += user +"\n";
        }
    }
        
    return file;
}



