var JSON = {
    "stringify": rteJSONStringify,
    "parse": rteJSONParse
};
var toJSON = lib.JSON2.toJSON;
var common = lib.ScorecardCommon;
var logger = getLog('ScorecardServlet');

function getRefreshInterval()
{
    return '00:00:30';
}

function convertMemeoryMB2GB(mem)
{
    /* format 1)nnnn.n 2)nnn.nn 3)nn.nnn */
    var memGB = 0;
    var point = 1;
    if (mem < 102400)/* < 100GB */
        point = 3;
    else if (mem < 1024000)/* < 1000GB */
        point = 2;
    memGB = mem/1024;
    return parseFloat(memGB.toFixed(point));
}

function findHost(hosts, host)
{
    var len = hosts.length();
    var i = 0;
    var find = false;
    for(i = 0; i < len; i++)
    {
        if (hosts[i] == host){
            find = true;
            break;
        }
    }
    if (hosts[0] == null)
        return 0;
    if (find = false && len != 0)
        i = len+1;
    return i;
}

function updateServletInfo()
{
    var curTime = funcs.str(funcs.tod(),3);
    var inf = new SCFile("scorecardNodes");
    var queryCount = "select * from scorecardNodes where detdata=true and report.id > '"+curTime+"'";
    var record = inf.doCount(queryCount);
    if ( record < 1 ) {/* re-fetch */
        var endTime = common.calcInterval(curTime,getRefreshInterval());
        var strEndTime = lib.tzFunctions.convertDateStringToGMT(endTime,4);
        var f = collectSystemStatus(1,funcs.str(strEndTime,3)+',t');
        logger.debug('fetch nodes data, return results:'+f);
    }
    var inf = new SCFile("scorecardNodes");
    var query = "select * from scorecardNodes where detdata=true and report.id > '"+curTime+"' order by host";
    var rc = inf.doSelect(query);
    
    var serv = new SCFile("scorecardServlet");
    if (rc != RC_SUCCESS)
    {
        vars.$G_scorecard_host = 0;
        vars.$G_scorecard_sessions = "";
        vars.$G_scorecard_lb="";
        return serv;
    }
    var cnt = -1;
    
    var activeSession = new Array();
    var maxSession = new Array();
    var nodeID = 0;
    var nonNodeID = 0;
    var prcCount = 0;
    serv['lbport'] = 0;
    while(rc == RC_SUCCESS)
    {
        var find = findHost(serv['hosts_name'], inf['host']);
        if (find > cnt){/* add a host*/
            cnt = find;
            maxSession[cnt] = 0;
            activeSession[cnt] = 0;
            serv['hosts_memory'][cnt]=convertMemeoryMB2GB(inf['mem.avail'])+'/'+convertMemeoryMB2GB(inf['mem.total']);
            var perc = parseFloat(inf['cpu.total']).toFixed(2);
            serv['hosts_cpu_usage'][cnt]=perc+'%';
            serv['hosts_cores'][cnt]=inf['cores'];
            serv['hosts_noninstances'][cnt] = 0;
            serv['hosts_instances'][cnt] = 0;
        }
        serv['hosts_name'][cnt] = inf['host'];
        
        if (inf['islb'] == true){
            serv['lbhost'] = inf['host'];
            serv['lbport'] = inf['http.port'];
            inf['sessions.max'] = 0;
            inf['sessions.active'] = 0;
        }
        
        if (inf['servmode'] == false){
            serv['hosts_noninstances'][cnt] += 1;
        }
        else {
            serv['hosts_instances'][cnt] += 1;
            maxSession[cnt] += inf['sessions.max'];
            activeSession[cnt] += inf['sessions.active'];
        }
        serv['hosts_all'].hosts_all_name[prcCount] = inf['host'];
        if (inf['servmode'] == true) {
            serv['hosts_all'].hosts_all_server[prcCount] = true;
            serv['hosts_all'].hosts_all_data[prcCount] =
                inf['process.id']+","+
                inf['cluster.addr']+","+
                inf['state']+","+
                inf['lowmem']+","+
                inf['http.port']+","+
                inf['https.port']+","+
                inf['sessions.active']+"/"+inf['sessions.max']+","+
                inf['dbgmode']+","+
                inf['qmode']+","+
                inf['islb']+","+
                inf['host']+","+
                inf['cpu.proc']+","+
                inf['mem.proc'];
            prcCount++;
        }
        else {
            serv['hosts_all'].hosts_all_server[prcCount] = false;
            serv['hosts_all'].hosts_all_data[prcCount] =
                inf['process.id']+","+
                inf['cluster.addr']+","+
                inf['state']+","+
                inf['lowmem']+","+
                inf['cmdline']+","+
                inf['host']+","+
                inf['cpu.proc']+","+
                inf['mem.proc'];
            prcCount++;
        }
        
        rc = inf.getNext();
    }
    var host_len = serv['hosts_name'].length();
    serv['used_sessions'] = 0;
    serv['total_sessions'] = 0;
    for(var cnt = 0; cnt < host_len; cnt++) {
        serv['hosts_sessions'][cnt] = activeSession[cnt]+"/"+maxSession[cnt];
        serv['used_sessions'] += activeSession[cnt];
        serv['total_sessions'] += maxSession[cnt];
    }
    
    vars.$G_scorecard_host = host_len;
    vars.$G_scorecard_sessions = serv['used_sessions']+'/'+serv['total_sessions'];
    if (false == parmExists("external_lb")){
        if(serv['lbport'] == 0)
            vars.$G_scorecard_lb=funcs.scmsg("lbInfo2",'ScoreCard');
        else
            vars.$G_scorecard_lb=serv['lbhost']+':'+serv['lbport'];
    }
    else
        vars.$G_scorecard_lb=funcs.scmsg("lbInfo3",'ScoreCard');
    
    return serv;
}

function getCurrentHostInfo(line,record)
{
    if (line == 0)
        line = 1;
    if (line <= record['hosts_all'].hosts_all_name.length() && record['hosts_all'].hosts_all_name[0] != null)
    {
        var name = record['hosts_name'][line-1]
        var len = record['hosts_all'].hosts_all_name.length();
        var prcCount = 0;
        var prcNonCount = 0;
        var f = new SCFile("scorecardServlet");
        for(var i = 0; i < len; i++)
        {
            if (record['hosts_all'].hosts_all_name[i] == name)
            {
                if (record['hosts_all'].hosts_all_server[i] == true)
                {
                    var server = record['hosts_all'].hosts_all_data[i].split(",");
                    f['server'].server_id[prcCount] = parseInt(server[0]);
                    f['server'].server_clusteraddr[prcCount] = server[1];
                    f['server'].server_state[prcCount] = server[2];
                    f['server'].server_lowmem[prcCount] = server[3];
                    f['server'].server_httpport[prcCount] = parseInt(server[4]);
                    f['server'].server_httpsport[prcCount] = (parseInt(server[5])==0)? null:parseInt(server[5]);
                    f['server'].server_sessions[prcCount] = server[6];
                    f['server'].server_dbgmode[prcCount] = server[7];
                    f['server'].server_qmode[prcCount] = server[8];
                    f['server'].server_lb[prcCount] = server[9];
                    f['server'].server_name[prcCount] = server[10];
                    var perc = parseFloat(server[11]).toFixed(2);
                    f['server'].server_cpu_usage[prcCount] = perc+'%';
                    f['server'].server_mem_used[prcCount] = convertMemeoryMB2GB(server[12]);
                    prcCount++;
                }
                else
                {
                    var server = record['hosts_all'].hosts_all_data[i].split(",");
                    f['nonserver'].nonserver_id[prcNonCount] = parseInt(server[0]);
                    f['nonserver'].nonserver_clusteraddr[prcNonCount] = server[1];
                    f['nonserver'].nonserver_state[prcNonCount] = server[2];
                    f['nonserver'].nonserver_lowmem[prcNonCount] = server[3];
                    f['nonserver'].nonserver_cmdline[prcNonCount] = server[4];
                    f['nonserver'].nonserver_name[prcNonCount] = server[5];
                    var perc = parseFloat(server[6]).toFixed(2);
                    f['nonserver'].nonserver_cpu_usage[prcNonCount] = perc+'%';
                    f['nonserver'].nonserver_mem_used[prcNonCount] = convertMemeoryMB2GB(server[7]);
                    prcNonCount++;
                }
            }
        }
        record['server'] = f['server'];
        record['nonserver'] = f['nonserver'];
    }
}

function buildHostHeader(arrLen)
{
    var str = new Array();
    str.push(common.packageElements(funcs.scmsg("hostName",'ScoreCard'),arrLen[0]));
    str.push(common.packageElements(funcs.scmsg("sessionUsage",'ScoreCard'),arrLen[1]));
    str.push(common.packageElements(funcs.scmsg("serverInstanceCount",'ScoreCard'),arrLen[2]));
    str.push(common.packageElements(funcs.scmsg("systemProcessCount",'ScoreCard'),arrLen[3]));
    str.push(common.packageElements(funcs.scmsg("cpuCores",'ScoreCard'),arrLen[4]));
    str.push(common.packageElements(funcs.scmsg("cpuUsage",'ScoreCard'),arrLen[5]));
    str.push(common.packageElements(funcs.scmsg("memUsage",'ScoreCard'),arrLen[6]));
    return str;
}

function buildServerHeader(arrLen)
{
    var str = new Array();
    str.push(common.packageElements(funcs.scmsg("processId",'ScoreCard'),arrLen[0]));
    str.push(common.packageElements(funcs.scmsg("clusterAddress",'ScoreCard'),arrLen[1]));
    str.push(common.packageElements(funcs.scmsg("state",'ScoreCard'),arrLen[2]));
    str.push(common.packageElements(funcs.scmsg("httpPort",'ScoreCard'),arrLen[3]));
    str.push(common.packageElements(funcs.scmsg("httpsPort",'ScoreCard'),arrLen[4]));
    str.push(common.packageElements(funcs.scmsg("sessions",'ScoreCard'),arrLen[5]));
    str.push(common.packageElements(funcs.scmsg("dbgMode",'ScoreCard'),arrLen[6]));
    str.push(common.packageElements(funcs.scmsg("qMode",'ScoreCard'),arrLen[7]));
    str.push(common.packageElements(funcs.scmsg("lb",'ScoreCard'),arrLen[8]));
    str.push(common.packageElements(funcs.scmsg("cpuUsage",'ScoreCard'),arrLen[9]));
    str.push(common.packageElements(funcs.scmsg("memUsed",'ScoreCard'),arrLen[10]));
    str.push(common.packageElements(funcs.scmsg("lowMem",'ScoreCard'),arrLen[11]));
    return str;
}

function buildSystemHeader(arrLen)
{
    var str = new Array();
    str.push(common.packageElements(funcs.scmsg("processId",'ScoreCard'),arrLen[0]));
    str.push(common.packageElements(funcs.scmsg("clusterAddress",'ScoreCard'),arrLen[1]));
    str.push(common.packageElements(funcs.scmsg("state",'ScoreCard'),arrLen[2]));
    str.push(common.packageElements(funcs.scmsg("cpuUsage",'ScoreCard'),arrLen[3]));
    str.push(common.packageElements(funcs.scmsg("memUsed",'ScoreCard'),arrLen[4]));
    str.push(common.packageElements(funcs.scmsg("lowMem",'ScoreCard'),arrLen[5]));
    str.push(common.packageElements(funcs.scmsg("cmdLineParam",'ScoreCard'),arrLen[6]));
    return str;
}

function buildServerNode(node,arrLen)
{
    var line = "";
    var str = new Array();
    line += common.packageElements(node['process.id'],arrLen[0]);
    line += common.packageElements(node['cluster.addr'],arrLen[1]);
    line += common.packageElements(node['state'],arrLen[2]);
    line += common.packageElements(node['http.port'],arrLen[3]);
    line += common.packageElements(node['https.port']==0? ' ':node['https.port'],arrLen[4]);
    line += common.packageElements(node['sessions.active']+"/"+node['sessions.max'],arrLen[5]);
    line += common.packageElements(node['dbgmode'],arrLen[6]);
    line += common.packageElements(node['qmode'],arrLen[7]);
    line += common.packageElements(node['islb'],arrLen[8]);
    var perc = parseFloat(node['cpu.proc']).toFixed(2);
    line += common.packageElements(perc+'%',arrLen[9]);
    line += common.packageElements(convertMemeoryMB2GB(node['mem.proc']),arrLen[10]);
    line += common.packageElements(node['lowmem'],arrLen[11]);
    return line+'\n';
}

function buildSystemNode(node,arrLen)
{
    var str = new Array();
    var line = "";
    line += common.packageElements(node['process.id'],arrLen[0]);
    line += common.packageElements(node['cluster.addr'],arrLen[1]);
    line += common.packageElements(node['state'],arrLen[2]);
    var perc = parseFloat(node['cpu.total']).toFixed(2);
    line += common.packageElements(perc+'%',arrLen[3]);
    line += common.packageElements(convertMemeoryMB2GB(node['mem.proc']),arrLen[4]);
    line += common.packageElements(node['lowmem'],arrLen[5]);
    line += common.packageElements(node['cmdline'],arrLen[6]);
    return line+'\n';
}

function buildBody(body,maxLen,servHeader,sysHeader)
{
    var file = "";
    file += "\n"+funcs.scmsg( "hostName", 'ScoreCard')+":"+body[0]+"\n";
    file += common.buildHorizontalDivider('-',maxLen);
    
    file += common.buildMidDivider('-',funcs.scmsg( "serverInstanceCount", 'ScoreCard'),maxLen)+'\n';
    file += servHeader;
    file += body[1];
    file += common.buildMidDivider('-',funcs.scmsg( "systemProcessCount", 'ScoreCard'),maxLen)+'\n';
    file += sysHeader;
    file += body[2];
    return file;
}

function buildServletInformation()
{
    var curTime = funcs.str(funcs.tod(),3);
    var inf = new SCFile("scorecardNodes");
    var queryCount = "select * from scorecardNodes where detdata=true and report.id > '"+curTime+"'";
    var record = inf.doCount(queryCount);
    if ( record < 1 ) {/* re-fetch */
        var endTime = common.calcInterval(curTime,getRefreshInterval());
        var strEndTime = lib.tzFunctions.convertDateStringToGMT(endTime,4);
        var f = collectSystemStatus(1,funcs.str(strEndTime,3)+',t');
        logger.debug('re-fetch servlet data. return: '+f);
    }
    var inf = new SCFile("scorecardNodes");
    var query = "select * from scorecardNodes where detdata=true and report.id > '"+curTime+"' order by host";
    var rc = inf.doSelect(query);
    if (rc != RC_SUCCESS || inf['host'] == null)
    {
        logger.error('buildServletInformation failed!');
        return "";
    }
    var serv = new SCFile("scorecardServlet");
    var cnt = -1;
    
    var activeSession = new Array();
    var maxSession = new Array();
    var nodeID = 0;
    var nonNodeID = 0;
    var prcCount = 0;
    var overview = "";
    
    var body = ["","",""];
    var file = "";
    serv['lbport'] = 0;
    
    var servHeaderLen = [14,34,14,14,14,14,14,16,16,14,20,16];
    var str = buildServerHeader(servHeaderLen);
    var servLine = "";
    
    var maxLen = 0;
    for(var i = 0; i < str.length; i++){
        servHeaderLen[i] = str[i].length;
        servLine += str[i];  
        maxLen += servHeaderLen[i];
    }
    servLine += '\n';
    if (maxLen < 188)
        maxLen = 188;
        
    var sysHeaderLen = [14,34,14,14,20,14,-1];    
    var str1 = buildSystemHeader(sysHeaderLen);
    var sysLine = "";
    for(var i = 0; i < str1.length; i++){
        sysHeaderLen[i] = str1[i].length;
        sysLine += str1[i];  
    }
    sysLine += '\n';
    
    var hostHeaderLen = [34,22,22,22,22,22,22];    
    var str2 = buildHostHeader(hostHeaderLen);
    var hostLine = "";
    for(var i = 0; i < str2.length; i++){
        hostHeaderLen[i] = str2[i].length;
        hostLine += str2[i];  
    }
    hostLine += '\n';
    
    while(rc == RC_SUCCESS)
    {
        var find = findHost(serv['hosts_name'], inf['host']);
        if (find > cnt){/* add a host*/
            cnt = find;
            if (find > 0){
                file += buildBody(body,maxLen,servLine,sysLine);
                body[1] = "";
                body[2] = "";
            }
            maxSession[cnt] = 0;
            activeSession[cnt] = 0;
            serv['hosts_memory'][cnt]=convertMemeoryMB2GB(inf['mem.avail'])+'/'+convertMemeoryMB2GB(inf['mem.total']);
            var perc = parseFloat(inf['cpu.total']).toFixed(2);
            serv['hosts_cpu_usage'][cnt]=perc+'%';
            serv['hosts_cores'][cnt]=inf['cores'];
            serv['hosts_noninstances'][cnt] = 0;
            serv['hosts_instances'][cnt] = 0;
            serv['hosts_name'][cnt] = inf['host'];
            body[0] = inf['host'];
        }
        
        
        if (inf['islb'] == true){
            serv['lbhost'] = inf['host'];
            serv['lbport'] = inf['http.port'];
            inf['sessions.max'] = 0;
            inf['sessions.active'] = 0;
        }
        
        if (inf['servmode'] == false){
            serv['hosts_noninstances'][cnt] += 1;
        }
        else {
            serv['hosts_instances'][cnt] += 1;
            maxSession[cnt] += inf['sessions.max'];
            activeSession[cnt] += inf['sessions.active'];
        }
        
        if (inf['islb'] == true){
            serv['lbhost'] = inf['host'];
            serv['lbport'] = inf['http.port'];
        }
        if (inf['servmode'] == true){
            body[1] += buildServerNode(inf,servHeaderLen);
        }
        else {
            body[2] += buildSystemNode(inf,sysHeaderLen);
        }
        
        rc = inf.getNext();
    }
    
    overview += common.buildMidDivider('-',funcs.scmsg( "report", 'ScoreCard',[funcs.scmsg("servletStatus",'ScoreCard')]),maxLen)+'\n';
    overview += funcs.scmsg("reportTime",'ScoreCard')+': '+funcs.tod()+"\n";
    overview += common.buildHorizontalDivider('-',maxLen)+'\n';
    
    var host_len = serv['hosts_name'].length();
    overview += funcs.scmsg("hostNumber",'ScoreCard')+":"+host_len+'\n';
    serv['used_sessions'] = 0;
    serv['total_sessions'] = 0;
    for(var cnt = 0; cnt < host_len; cnt++) {
        serv['hosts_sessions'][cnt] = activeSession[cnt]+"/"+maxSession[cnt];
        serv['used_sessions'] += activeSession[cnt];
        serv['total_sessions'] += maxSession[cnt];
    } 
    file += buildBody(body,maxLen,servLine,sysLine);
    overview += funcs.scmsg("sessionUsage",'ScoreCard')+":"+serv['used_sessions']+'/'+serv['total_sessions']+'\n';
    
    overview += funcs.scmsg("lb",'ScoreCard')+":";
    
    if (false == parmExists("external_lb")){    
        if(serv['lbport'] == 0)
            overview += funcs.scmsg("lbInfo2",'ScoreCard') + "\n\n";
        else
            overview += serv['lbhost']+':'+serv['lbport'] + "\n\n";
    }
    else
        overview += funcs.scmsg("lbInfo3",'ScoreCard')+ "\n\n";
        
    overview += common.buildMidDivider('-',funcs.scmsg( "hostsOverview", 'ScoreCard'),maxLen)+'\n';
    
    overview += hostLine;
    for(var i = 0; i < host_len; i++)
    {
        overview += common.packageElements(serv['hosts_name'][i],hostHeaderLen[0]);
        overview += common.packageElements(activeSession[i]+"/"+maxSession[i],hostHeaderLen[1]);
        overview += common.packageElements(serv['hosts_instances'][i],hostHeaderLen[2]);
        overview += common.packageElements(serv['hosts_noninstances'][i],hostHeaderLen[3]);
        overview += common.packageElements(serv['hosts_cores'][i],hostHeaderLen[4]);
        overview += common.packageElements(serv['hosts_cpu_usage'][i],hostHeaderLen[5]);
        overview += common.packageElements(serv['hosts_memory'][i],hostHeaderLen[6]);
        overview += "\n";
    }
    overview += "\n"+funcs.scmsg("hostList",'ScoreCard')+":\n";
    return overview+file;
    
}
