var logger = getLog('ScorecardService');

var common = lib.ScorecardCommon;
var license = lib.ScorecardLicense;
var userInfo = lib.ScorecardUser;

function queryLicenseInfo() {
    /* contruct struct */
    var meta = {
        'expirationDate': '',
        'loginLicFields': [],
        'unlimitedLicFields': [],
        'limitedLicFields': [],
        'essLicFields': []
    };
    var licInfo = {
        "meta": "",
        "loginLics": [],
        "foundationLics": [],
        "scautoLics": [],
        "helpdeskLics": [],
        "moduleLics": [],
        "essLics": []
    };
    var len = 0;
    var count = 0;
    var module = "";
    var lic = getLicInfo();
    var jlic = JSON.parse(lic);
    var item = [];
    meta["expirationDate"] = jlic.EXPIRATION;
    /* process Fields */
    module = common.setField("licenseName", funcs.scmsg('licenseName', 'ScoreCard'));
    meta['loginLicFields'].push(module);
    meta['unlimitedLicFields'].push(module);
    meta['limitedLicFields'].push(module);
    meta['essLicFields'].push(module);

    var md1 = common.setTypeField("licUsed", funcs.scmsg("licUsed", 'ScoreCard'), 'color-value');
    meta['loginLicFields'].push(md1);
    common.setFieldArray(meta['loginLicFields'], ["licAvail"]);

    common.setFieldArray(meta['unlimitedLicFields'], ["namedLicState", "floatingLicState"]);

    item = ["namedLicUsed", "namedLicAvail", "floatingLicUsed", "floatingLicAvail"];
    common.setFieldArray(meta['limitedLicFields'], item);

    common.setFieldArray(meta['essLicFields'], ["licUsed", "licAvail"]);

    module = license.setLoginLic("Login License (Named)", jlic.BASE[0].namedLicUsed, jlic.BASE[0].namedLicAvail);
    licInfo['loginLics'].push(module);
    module = license.setLoginLic("Login License (Floating)", jlic.BASE[0].floatingLicUsed, jlic.BASE[0].floatingLicAvail);
    licInfo['loginLics'].push(module);
    licInfo["meta"] = meta;

    /* process HELPDESK */
    len = jlic.HELPDESK.length;
    for (count = 0; count < len; count++) {
        if (jlic.HELPDESK[count].licenseName == "Self Service Ticketing") {
            module = license.setLoginLic(jlic.HELPDESK[count].licenseName, jlic.HELPDESK[count].essLoginLicUsed, "Unlimited");
            licInfo['loginLics'].push(module);
        } else {
            licInfo['helpdeskLics'].push(jlic.HELPDESK[count]);
        }
    }
    /* process OTHER  */
    len = jlic.OTHER.length;
    for (count = 0; count < len; count++) {
        if (jlic.OTHER[count].licenseName == "Service Catalog" || jlic.OTHER[count].licenseName == "Knowledge Management ESS") {
            module = license.setLoginLic(jlic.OTHER[count].licenseName, jlic.OTHER[count].floatingLicUsed, jlic.OTHER[count].floatingLicAvail);
            licInfo['essLics'].push(module);
        } else {
            licInfo['moduleLics'].push(jlic.OTHER[count]);
        }
    }
    /* process FOUNDATION  */
    len = jlic.FOUNDATION.length;
    for (count = 0; count < len; count++) {
        if (jlic.FOUNDATION[count].hasOwnProperty('namedLicUsed')) {
            module = license.setStateModuleLic(jlic.FOUNDATION[count].licenseName, jlic.FOUNDATION[count].namedLicUsed + "/" + jlic.FOUNDATION[count].namedLicAvail,
                jlic.FOUNDATION[count].floatingLicUsed + "/" + jlic.FOUNDATION[count].floatingLicAvail);
            licInfo['foundationLics'].push(module);
        } else {
            licInfo['foundationLics'].push(jlic.FOUNDATION[count]);
        }
    }

    /* process SMAUTO  */
    len = jlic.SMAUTO.length;
    for (count = 0; count < len; count++) {
        module = license.setStateModuleLicSCAuto(jlic.SMAUTO[count].licenseName, jlic.SMAUTO[count].namedLicState);
        licInfo['scautoLics'].push(module);
    }


    return licInfo;
}

function getPercentage(msg) {
    var tmp = msg.substr(0, msg.length - 1);
    var num = parseFloat((tmp / 100.0).toFixed(4));
    return num;
}

function getCurrentHostInfo(line, record) {
    var host = {
        "name": "",
        "sessionUsage": "",
        "serverInstanceCount": 0,
        "systemProcessCount": 0,
        "cpuCores": 0,
        "cpuUsage": 0.0,
        "memUsage": "",
        "serverInstances": [],
        "systemProcesses": []
    };

    if (line < record['hosts_all'].hosts_all_name.length() && record['hosts_all'].hosts_all_name[0] != null) {
        var name = record['hosts_name'][line]
        var len = record['hosts_all'].hosts_all_name.length();
        var prcCount = 0;
        var prcNonCount = 0;
        var i = 0;

        for (i = 0; i < len; i++) {
            if (record['hosts_all'].hosts_all_name[i] == name) {
                if (record['hosts_all'].hosts_all_server[i] == true) {
                    var server = record['hosts_all'].hosts_all_data[i].split(",");
                    var serverInstance = {
                        "sessions": "",
                        "processId": 0,
                        "httpPort": 0,
                        "dbgMode": "",
                        "lb": "",
                        "qMode": "",
                        "state": "",
                        "httpsPort": 0,
                        "clusterAddress": "",
                        /*"lowMem": "",*/
                        "cpuUsage": 0.0,
                        "memUsed": 0
                    };
                    serverInstance['processId'] = parseInt(server[0]);
                    serverInstance['clusterAddress'] = server[1];
                    serverInstance['state'] = server[2];
                    /*serverInstance['lowMem'] = server[3];*/
                    serverInstance['httpPort'] = (parseInt(server[4]) == 0) ? null : parseInt(server[4]);
                    serverInstance['httpsPort'] = (parseInt(server[5]) == 0) ? null : parseInt(server[5]);;
                    serverInstance['sessions'] = server[6];
                    serverInstance['dbgMode'] = server[7];
                    serverInstance['qMode'] = server[8];
                    serverInstance['lb'] = server[9];
                    serverInstance['cpuUsage'] = getPercentage(server[11]);
                    serverInstance['memUsed'] = lib.ScorecardServlet.convertMemeoryMB2GB(server[12]);
                    host['serverInstances'].push(serverInstance);
                    prcCount++;
                } else {
                    var server = record['hosts_all'].hosts_all_data[i].split(",");
                    var systemProcess = {
                        "cmdLineParam": "",
                        "processId": 0,
                        "state": "",
                        "clusterAddress": "",
                        /*"lowMem": "",*/
                        "cpuUsage": 0.0,
                        "memUsed": 0
                    };
                    systemProcess['processId'] = parseInt(server[0]);
                    systemProcess['clusterAddress'] = server[1];
                    systemProcess['state'] = server[2];
                    /*systemProcess['lowMem'] = server[3];*/
                    systemProcess['cmdLineParam'] = server[4];
                    systemProcess['cpuUsage'] = getPercentage(server[6]);
                    systemProcess['memUsed'] = lib.ScorecardServlet.convertMemeoryMB2GB(server[7]);
                    host['systemProcesses'].push(systemProcess);
                    prcNonCount++;
                }
            }
        }
        host['name'] = name;
        host['serverInstanceCount'] = prcCount;
        host['systemProcessCount'] = prcNonCount;

        for (i = 0; i < record['hosts.name'].length(); i++) {
            if (name == record['hosts.name'][i]) {
                host['sessionUsage'] = record['hosts.sessions'][i];
                host['cpuCores'] = parseInt(record['hosts.cores'][i]);
                host['memUsage'] = record['hosts.memory'][i];
                host['cpuUsage'] = getPercentage(record['hosts.cpu.usage'][i]);
                break;
            }
        }
        return host;
    }
    return null;
}

function queryServletInfo() {
    /* contruct struct */
    var meta = {
        'serverFields': [],
        'systemProcessFields': [],
        'hostFields': [],
        'overviewFields': []
    };
    var servletInfo = {
        "meta": "",
        "hostNumber": "",
        "sessionUsage": "",
        "lbInfo": '',
        "hosts": []
    };

    var file = lib.ScorecardServlet.updateServletInfo();
    if (file['hosts_all'].hosts_all_name[0] == null)
        return null;
    var i = 0;
    var len = file['hosts.name'].length();
    var module = "";

    var size = 0;
    var item = ["processId", "clusterAddress", "memUsed"];

    common.setFieldArray(meta['serverFields'], item);
    common.setFieldArray(meta['systemProcessFields'], item);

    common.setFieldArray(meta['serverFields'], ["httpPort", "httpsPort", "sessions"]);


    module = common.setTypeField("state", funcs.scmsg("state", 'ScoreCard'), 'color-text');
    meta['serverFields'].push(module);
    meta['systemProcessFields'].push(module);

    item = ["dbgMode", "qMode", "lb"];
    common.setTypeFieldArray(meta['serverFields'], 'boolean', item);

    module = common.setTypeField("cpuUsage", funcs.scmsg("cpuUsage", 'ScoreCard'), 'percentage');
    meta['serverFields'].push(module);
    meta['systemProcessFields'].push(module);
    /*
    module = common.setTypeField("lowMem",funcs.scmsg("lowMem",'ScoreCard'),'boolean-warn');
    meta['serverFields'].push(module);
    meta['systemProcessFields'].push(module);
    */
    module = common.setField("cmdLineParam", funcs.scmsg("cmdLineParam", 'ScoreCard'));
    meta['systemProcessFields'].push(module);


    item = ["sessionUsage", "serverInstanceCount", "systemProcessCount", "cpuCores", "memUsage"];
    common.setFieldArray(meta['hostFields'], item);

    module = common.setTypeField("cpuUsage", funcs.scmsg("cpuUsage", 'ScoreCard'), 'percentage');
    meta['hostFields'].push(module);

    common.setFieldArray(meta['overviewFields'], ["hostNumber", "sessionUsage"]);

    meta['overviewFields'].push(common.setField("lbInfo", funcs.scmsg("lb", 'ScoreCard')));

    /* push data */
    servletInfo['hostNumber'] = len;
    servletInfo['sessionUsage'] = file['used_sessions'] + '/' + file['total_sessions'];

    if (false == parmExists("external_lb")) {
        if (file['lbport'] == 0) {
            servletInfo['lbInfo'] = funcs.scmsg("lbInfo2", 'ScoreCard');
        } else {
            servletInfo['lbInfo'] = file['lbhost'] + ':' + file['lbport'];
        }
    } else
        servletInfo['lbInfo'] = funcs.scmsg("lbInfo3", 'ScoreCard');

    var host;
    for (i = 0; i < len; i++) {
        host = getCurrentHostInfo(i, file);
        if (host != null)
            servletInfo['hosts'].push(host);
    }
    servletInfo["meta"] = meta;
    return servletInfo;
}

function scSearchUserList(Host, Pid, DeviceType, Lic, userName, limit) {
    var userList = {
        "total": 0,
        "count": 0,
        "userData": []
    };
    try {
        total = searchUserList(Host, Pid, DeviceType, Lic, userName);
    } catch (e) {
        total = -1;
    }
    if (total > 0) {
        userList = scGetUserList(0, limit)
    }
    return userList;
}


function scGetUserList(start, count) {
    var size = 0;
    var cnt = 0;
    var userList = {
        "count": 0,
        "total": 0,
        "userData": []
    };
    try {
        if (count < 1)
            return userList;

        var f = getUserList(start, count);
        userList["total"] = f[0];
        size = f.length;

        for (var i = 1; i < size; i++) {
            var userJson = userInfo.parseUser2Json(f[i]);
            if (userJson != null) {
                userList["userData"].push(userJson);
                cnt++;
            }
        }
    } catch (e) {
        size = -1;
    }
    userList["count"] = cnt;

    return userList;
}

function scGetUserHistory(hisData, count) {
    var maxHis = lib.settings.getSettingValue("Scorecard", "max.number.history");
    if (maxHis > 0 && maxHis < 100) {
        var fRec = new SCFile("scorecardUser");
        var setOrderByRC = fRec.setOrderBy(['update.date'], [SCFILE_DSC]);
        if (setOrderByRC == RC_SUCCESS) {
            var selectRC = fRec.doSelect("true");
            if (selectRC == RC_SUCCESS) {
                var results1 = [];
                var results2 = [];
                var cnt = 0;
                do {
                    results1.push(funcs.str(fRec["update.date"]));
                    results2.push(fRec["online.user"]);
                    cnt++;
                }
                while (fRec.getNext() == RC_SUCCESS && cnt < maxHis);
                while (cnt > 0) {
                    cnt--;
                    var content = {
                        "date": results1[cnt],
                        "userCount": results2[cnt]
                    };
                    hisData.push(content);
                }

            }
        }
        var content = {
            "date": "Now",
            "userCount": count
        };
        hisData.push(content);
    }
}

function scCreateUserList(type) {
    var UserInfo = {
        "total": 0,
        "hisData": [],
        "hostData": [],
        "deviceData": {}
    };
    var ret = createUserList(type);
    var len = ret.length;
    var count = 0;
    if (len > 2) {
        count = parseInt(ret[0]);
        UserInfo["total"] = count;
        var DeviceJson = userInfo.device2Json(ret[1], false);
        UserInfo["deviceData"] = DeviceJson;
        for (var i = 2; i < len; i++) {
            var Hosts = userInfo.hostsList2Json(ret[i]);
            UserInfo["hostData"].push(Hosts);
        }
    }
    scGetUserHistory(UserInfo["hisData"], count);
    return UserInfo;
}

function scGetUserInfoFields() {
    var meta = {
        "userInfoFields": [],
        "deviceFields": [],
        "userCount": "Online Users",
        "licItemFields": [],
        "deviceItemFields": [],
        "hisFields": []
    };

    var module = "";
    var userFields = ["userName", "processId", "deviceId", "loginTime", "idleTime", "TID", "sessionId", "hostName",
        "hostIP", "clientIP", "licType"
    ];
    var size = userFields.length;
    for (var i = 0; i < size; i++) {
        module = common.setField(userFields[i], funcs.scmsg(userFields[i], 'ScoreCard'));
        meta['userInfoFields'].push(module);
    }

    var deviceFields = ["clientType", "userCount"];
    size = deviceFields.length;
    for (var i = 0; i < size; i++) {
        module = common.setField(deviceFields[i], funcs.scmsg(deviceFields[i], 'ScoreCard'));
        meta['deviceFields'].push(module);
    }

    meta['userCount'] = funcs.scmsg("userCount", 'ScoreCard');
    meta['licItemFields'].push(funcs.scmsg("namedLic", 'ScoreCard'));
    meta['licItemFields'].push(funcs.scmsg("floatingLic", 'ScoreCard'));
    meta['licItemFields'].push(funcs.scmsg("unLimitedLic", 'ScoreCard'));

    var deviceItFields = ["Webtier-Index", "Webtier-ESS", "Win-Client", "SMA-SP", "Mobile-STD", "Mobile-ESS", "Other"];
    size = deviceItFields.length;
    for (var i = 0; i < size; i++) {
        module = common.setField(deviceItFields[i], deviceItFields[i]);
        meta['deviceItemFields'].push(module);
    }

    var his = ["date", "userCount"];
    size = his.length;
    for (var i = 0; i < size; i++) {
        module = common.setField(his[i], funcs.scmsg(his[i], 'ScoreCard'));
        module["drillDown"] = true;
        meta['hisFields'].push(module);
    }

    return meta;
}

function queryUserInfo(hostName, pid, deviceType, licType, limit) {
    var userInfo = {
        "meta": {},
        "userInfo": {},
        "userList": {}
    };

    userInfo["meta"] = scGetUserInfoFields();
    userInfo["userInfo"] = scCreateUserList(2);
    var count = scSearchUserList(hostName, pid, deviceType, licType, "*");
    userInfo["userList"] = scGetUserList(0, limit);

    return userInfo;
}

function scKillUser(sessionID, hostName, processID) {
    var rc = 0;
    var clustered = funcs.sysinfo_get("clustered");

    var frc = new SCDatum();
    if (sessionID < 1)
        return -1;

    var userID;
    if (clustered == false)
        userID = [sessionID];
    else {
        if (hostName == null || processID == null || hostName.length == 0)
            return -2;
        else {
            userID = [sessionID, hostName];
        }
    }

    try {
        rc = callrad("signal", ["name", "string1"], userID);
    } catch (e) {
        rc = -999; //system error
    }

    return [rc, sessionID];
}

function scKillUsers(userList) {
    var sz = userList["count"];
    var rc = [0, 0];

    if (sz = userList["userData"].length) {
        var i = 0;
        while (i < sz) {
            rc = scKillUser(userList["userData"][i]["sessionId"],
                userList["userData"][i]["hostName"],
                userList["userData"][i]["processId"]);
            i++;
            if (rc[0] != 0)
                break;
        }
    }
    return rc[0];

}

function queryScorecard(type) {

    var meta = {
        "servletFields": [],
        "licenseFields": [],
        "userInfoFields": []
    };
    var content = {};


    var size = 0;
    var item = ["hostName", "sessionUsage", "serverInstanceCount", "systemProcessCount"];
    common.setFieldArray(meta['servletFields'], item);
    meta['servletFields'][1]["type"] = "color-value";

    meta['servletFields'][0]["table"] = "servlet";
    meta['servletFields'][0]["drillDown"] = true;

    item = ["licenseName", "licUsed", "licAvail"];
    common.setFieldArray(meta['licenseFields'], item);
    meta['licenseFields'][1]["type"] = "color-value";
    meta['licenseFields'][0]["table"] = "userInformation";
    meta['licenseFields'][0]["drillDown"] = true;

    item = ["clientType", "userCount"];
    common.setFieldArray(meta['userInfoFields'], item);
    meta['userInfoFields'][0]["table"] = "userInformation";
    meta['userInfoFields'][0]["drillDown"] = true;

    content["meta"] = meta;
    content["settings"] = common.getSettingsJsonData();

    var serv = lib.ScorecardServlet.updateServletInfo();

    var servletOverview = {
        "hostNumber": vars.$G_scorecard_host,
        "sessionUsage": vars.$G_scorecard_sessions,
        "lbInfo": funcs.scmsg("lb", 'ScoreCard') + ": " + vars.$G_scorecard_lb
    };
    content["servletOverview"] = servletOverview;

    size = serv['hosts_name'].length();
    var servletList = [];
    for (var i = 0; i < size; i++) {
        var host = {};
        host["hostName"] = serv['hosts_name'][i];
        host["sessionUsage"] = serv['hosts_sessions'][i];
        host["serverInstanceCount"] = serv['hosts_instances'][i];
        host["systemProcessCount"] = serv['hosts_noninstances'][i];
        servletList.push(host);
    }
    content["servletList"] = servletList;

    var lic = lib.ScorecardLicense.updateLicenseInfo();
    size = lic["overview.name"].length();
    var licenseList = [];

    if (size == 3) {
        var order = [1, 2, 0];
        for (var i = 0; i < size; i++) {
            var module = {};
            module["licenseName"] = lic['overview.name'][order[i]];
            module["licUsed"] = lic['overview.used'][order[i]];
            module["licAvail"] = lic['overview.avail'][order[i]];
            licenseList.push(module);
        }
        content["licenseList"] = licenseList;
    }

    var userInfoList = [];
    var ret = createUserList(type);
    var len = ret.length;
    var userCount = 0;
    if (len > 2) {
        userCount = parseInt(ret[0]);
        var DeviceJson = userInfo.device2Json(ret[1], true);
        userInfoList = DeviceJson;
    }

    content["userInfoList"] = userInfoList;
    var userInfoOverview = {
        "onlineCounter": userCount
    };
    content["userInfoOverview"] = userInfoOverview;
    return content;
}

function getClientTypeData(date) {

    var rcData = { "deviceData": [] };
    if (date == "Now")
        return rcData;
    try {
        var f = new SCFile("scorecardUser");
        var rc = f.doSelect("update.date='" + date + "'");
        if (rc == RC_SUCCESS) {
            var rte_item = ["Webtier-Index", "Webtier-ESS", "Win-Client", "SMA-SP", "Mobile-STD", "Mobile-ESS", "Other"];
            var db_item = ["soap.web", "ess.web", "soap.win", "gateway", "soap.mobstd", "soap.mobess", "other"];
            for (var i = 0; i < db_item.length; i++) {
                var module = {};
                module["clientType"] = rte_item[i];
                module["userCount"] = f[db_item[i]];
                rcData["deviceData"].push(module);
            }
        }
    } catch (e) {
        logger.error("ERROR: getClientTypeDate failed, date=" + date);
    }

    return rcData;
}