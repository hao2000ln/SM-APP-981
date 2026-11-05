var toJSON = lib.JSON2.toJSON;
var logger = getLog('ScorecardAsyncUpdate');

function getProcessInfo()
{
    var f = getMemCPULoad();
    var results ={
        "mem_total":0,
        "mem_proc":0,
        "mem_avail":0,
        "cpu_total":0,
        "cpu_proc":0,
        "cores":0
    };
    var body = f.split(' ');
    var tmp;
    
    tmp = body[0].split(':');
    tmp = tmp[1].substr(0,tmp[1].length-2);
    results['mem_total'] = parseInt(tmp);
    tmp = body[1].split(':');
    tmp = tmp[1].substr(0,tmp[1].length-2);
    results['mem_avail'] = parseInt(tmp);
    tmp = body[2].split(':');
    tmp = tmp[1].substr(0,tmp[1].length-2);
    results['mem_proc'] = parseInt(tmp);
    tmp = body[3].split(':');
    tmp = tmp[1].substr(0,tmp[1].length);
    results['cores'] = parseInt(tmp);
    tmp = body[4].split(':');
    tmp = tmp[1].substr(0,tmp[1].indexOf('%'));
    results['cpu_total'] = parseFloat(tmp);
    tmp = body[5].split(':');
    tmp = tmp[1].substr(0,tmp[1].indexOf('%'));
    results['cpu_proc'] = parseFloat(tmp);
    
    return results;
}

function updateNode(body)
{
    var inf = new SCFile("scorecardNodes");
    var rc = inf.doSelect("detdata=true and cluster.addr = \""+body['clusterAddress']+"\"");
    var type = body['reportID'].split(',');
    inf['host'] = body['Host'];
    inf['cluster.addr'] = body['clusterAddress']; 
    inf['state'] = body['state']; 
    inf['cmdline'] = body['cmdLine']; 
    /* convert to GMT */
    var localOrder = lib.tzFunctions.getLocalDateOrder();
    var localZoon = lib.tzFunctions.getLocalTimeZone();
    var strdate = lib.tzFunctions.convertDateStringOnTZ(type[0],"Greenwich/Universal",4,localZoon,localOrder);
    inf['report.id'] = funcs.val(strdate,3);
    inf['http.port'] = body['httpPort'];
    inf['https.port'] = body['httpsPort'];
    inf['process.id'] = body['processId'];
    inf['sessions.max'] = body['MaxSessions'];
    inf['sessions.active'] = body['ActiveSessions']; 
    inf['islb'] = body['isLB']; 
    inf['servmode'] = body['servMode']; 
    inf['qmode'] = body['qMode']; 
    inf['dbgmode'] = body['dbgMode']; 
    inf['lowmem'] = body['lowMem'];
    
    var sys = getProcessInfo();
    inf['mem.total'] = sys['mem_total'];
    inf['mem.proc'] = sys['mem_proc'];
    inf['mem.avail'] = sys['mem_avail'];
    inf['cpu.total'] = sys['cpu_total'];
    inf['cpu.proc'] = sys['cpu_proc'];
    inf['cores'] = sys['cores'];
    
    /* insert record data */
    var ret = "success";
    if (type[1] == 't'){
        if ( rc != RC_SUCCESS ){
            inf['detdata'] = true;
            rc = inf.doInsert();
        }
        else {
           inf['detdata'] = true;
           rc = inf.doUpdate();
        }
    }
    else{
        inf['detdata'] = false;
        rc = inf.doInsert();
    }
    logger.debug(inf);      
    return rc;
}

function uploadSystemStatus(message)
{
    var bOK = true;
    if (message == null) {
        logger.error("uploadSystemStatus failed, message is null!");
        return false;
    }
    
    var jinf = JSON.parse(message);
    if (jinf.header == 'servlet')
    {
        rc = updateNode(jinf['body']);
        if ( rc != RC_SUCCESS )
            logger.error('updateNode failed!');
    }
    return bOK;
}

function snapshotLicense()
{
    var inf = new SCFile("scorecardLicense");
    inf = lib.ScorecardLicense.updateLicenseInfo();
    inf['detdata'] = false;
    var rc = inf.doInsert();
    if ( rc != RC_SUCCESS )
        logger.error('snapshotLicense failed!');
}
function snapshotServlet()
{
    var curTime = funcs.str(funcs.tod(),3);
    var strdate = lib.tzFunctions.convertDateStringToGMT(curTime,4);
    var f = collectSystemStatus(1,strdate+',f');
    logger.debug('snapshotServlet, return code: '+f);
}

function snapshotUserInfo()
{
    try{
        var user = createUserList(2);
    
        var rte_item = ["Webtier-Index", "Webtier-ESS", "Win-Client", "SMA-SP", "Mobile-STD", "Mobile-ESS", "Other"];
        var db_item = ["soap.web", "ess.web", "soap.win", "gateway", "soap.mobstd", "soap.mobess", "other"];
        var f = new SCFile("scorecardUser");
        
        f["online.user"] = parseInt(user[0]);
        var list = user[1].split(';');
        var size = list.length;
        for(var i = 0; i < size; i++){
            var sublist = list[i].split(':');
            if (sublist.length == 2){
                var sz = rte_item.length;
                for (var i = 0; i < sz; i++){
                    if (sublist[0] == rte_item[i]){
                        f[db_item[i]] = parseInt(sublist[1]);
                        break;
                    }
                }    
            }
        }
                
        f["update.date"] = funcs.val(funcs.tod(),3);
        
        var rc = f.doInsert();
        
        if (rc == RC_SUCCESS)
            logger.debug("snapshotUserInfo success.");
        else
            logger.error("snapshotUserInfo failed.");
    }
    catch (e){
        logger.error("snapshotUserInfo failed with exception: "+e);
    }

}


