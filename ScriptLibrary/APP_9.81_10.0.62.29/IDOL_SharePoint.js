// http://en.wikipedia.org/wiki/List_of_file_signatures

//this function returns an array contains all online sharepointconnector url array and tasks array 
//as format[[spconnectorurl1, spconnectorurl2, ..],[taskname1, taskname2, ..]]
var IDOLKMIndexService = lib.IDOLKMIndexService.require();
var logger = getLog('IDOL_SharePoint');

var IDOL_SharePoint = (function() {
    var IDOLRequest = lib.IDOLRequest.require();
    var xQuery = lib.XQuery.require();

    function getSharePointConfig(idolserverinfo, type) {
        var result = [];

        var arrUrl = [];
        var arrStatus = [];

        var idolConfig = idolserverinfo;
        if (!idolConfig) {
            idolConfig = lib.IDOLConfigure.require().getConfig();
        }
        var otherURL = funcs.denull(idolConfig['other.urls']);

        for (var i = 0, j = otherURL.length(); i < j; i++) {
            var tmpType = otherURL[i].pop();
            if (tmpType === type) {
                var url = otherURL[i].pop();
                //var url = otherURL[i]['url'];
                var status = lib.jsaci.checkServerStatus(url, true);
                arrStatus.push(status);
                arrUrl.push(url);
            }
        }

        result[0] = arrUrl;
        result[1] = arrStatus;
        return result;

    }

    function getSharePointConnectors(type) {

        var idolConfig = lib.IDOLConfigure.require().getConfig();
        var otherURL = funcs.denull(idolConfig['other.urls']);
        var result = [];

        for (var i = 0, j = otherURL.length(); i < j; i++) {
            var connUrl = otherURL[i].shift();
            var connType = otherURL[i].shift();
            if (connUrl && connType === type) {
                result.push(connUrl);
            }
        }
        /*var connUrl = connUrlArr[i];
         var status = connStatusArr[i];
         if(status == true){
         var taskArr = monitor.getSPTask(connUrl);
         for(var m = 0, n = taskArr.length; m < n; m++) {
         taskName = taskArr[m];
         connUrls.push(connUrlArr[i]);
         taskNames.push(taskName);
         }
         }*/


        /*var connUrls = [];
         var taskNames = [];
         var monitor = lib.IDOL_Monitor.require();
         var spConfig = monitor.getSharePointConfig();
         var connUrlArr = spConfig[0];
         var connStatusArr = spConfig[1];
         for(var i = 0, j = connUrlArr.length; i < j; i++) {
         var connUrl = connUrlArr[i];
         var status = connStatusArr[i];
         if(status == true){
         var taskArr = monitor.getSPTask(connUrl);
         for(var m = 0, n = taskArr.length; m < n; m++) {
         taskName = taskArr[m];
         connUrls.push(connUrlArr[i]);
         taskNames.push(taskName);
         }
         }
         }

         result[0] = connUrls;
         result[1] = taskNames;*/
        return result;
    }

    function getTaskByConnector(url) {
        var idolConfig = lib.IDOLConfigure.require().getConfig();
        var status = lib.jsaci.checkServerStatus(url, idolConfig['use.oem.license']);
        var taskArr = [];
        if (status == true) {
            var taskArr = getSPTask(url);
        }
        return taskArr;
    }

    function getSharePointConnConfig(spConnUrl) {
        var servicePort = getSharePointServicePort(spConnUrl);
        var serviceUrl = spConnUrl.split(':')[0].trim() + servicePort + "/";
        var response = IDOLRequest.doIDOLGet(serviceUrl, {action: 'getconfig'});
        return response;
    }

    function getSharePointServicePort(spConnUrl) {
        var response = IDOLRequest.doIDOLGet(spConnUrl, {action: 'getstatus'});
        var servicePort = xQuery.queryText('responsedata/serviceport', response);
        return servicePort;
    }


    function getSharePointStatus(spConnUrl, token) {
        if (!spConnUrl || !token) {
            return lib.KMCollection_Status_Constant.INDEXSTATUS_OFFLINE();
        }
        var result = '';
        var params = {
            action: 'QueueInfo',
            QueueAction: 'progress',
            QueueName: 'Fetch',
            AllStages: 'false',
            MaxDepth: '1',
            Token: token
        };
        try {
        	var response = IDOLRequest.doIDOLGet(spConnUrl, params);
        	var status = xQuery.queryText('responsedata/action/status', response);
        	if (status === 'Finished') {
            	result = lib.KMCollection_Status_Constant.INDEXSTATUS_FINISHED();
        	} else if (status === 'Queued') {
            	result = lib.KMCollection_Status_Constant.INDEXSTATUS_NOTSTARTED();
        	} else if (status === 'Processing') {
            	result = lib.KMCollection_Status_Constant.INDEXSTATUS_INDEXING();
        	}
        } catch (ex) {
        	funcs.msg(funcs.scmsg('102', 'idol', [spConnUrl]), 3);
        	result = lib.KMCollection_Status_Constant.INDEXSTATUS_OFFLINE();
        }
        return result;
    }

    function fullReindex(kmknowledgebase) {
        var spUrl = kmknowledgebase['spconnectorurl'];
        var spTask = kmknowledgebase['sptask'];

        //delete existing db
        IDOLKMIndexService.deleteIndexDB(kmknowledgebase['kbname']);

        //delete previous connector data
        var response = IDOLRequest.doIDOLGet(spUrl, {action: 'PurgeDatastore', section: spTask});

        //create a new db
        IDOLKMIndexService.createIndexDB(kmknowledgebase['kbname']);

        var param = 'action=Fetch&FetchAction=Synchronize&TaskSections=' + spTask + '&IngestActions=META:DREDBNAME=' + kmknowledgebase['kbname'] + ',META:ContentStore=GlobalSearch';
        if (((kmknowledgebase['kbtype'] === 'splib') || (kmknowledgebase['kbtype'] === 'confluencelib')) && !kmknowledgebase['no.security']) {
            param += ',META:SECURITYTYPE=SharePoint';
        }
        else if(kmknowledgebase['kbtype'] === 'okmlib' && kmknowledgebase['featurescript'])
        {
          try
          {
            var lua=eval('lib.'+kmknowledgebase['featurescript']+'.getOKMParseScriptName()');
            if(lua)
            {
               param += ',LUA:'+lua;
            }
          }
          catch(e)
          {
          }
        }
        try {
            var response = lib.jsaci.runIDOLAction(spUrl + param, false);
            var xml = new XML();
            xml.setContent(response);
            var token = xQuery.queryText('responsedata/token', xml);
			if (kmknowledgebase.indexstatus !== lib.KMCollection_Status_Constant.INDEXSTATUS_INDEXING()) {
	            kmknowledgebase.indexstatus = lib.KMCollection_Status_Constant.INDEXSTATUS_INDEXING();
	            kmknowledgebase['lastindextime'] =new Date();
	            if(kmknowledgebase['kbtype'] === 'okmlib' && kmknowledgebase['featurescript'])
	            {
	              lib.IDOLGlobalSearchOKM.applyDefaultValue(kmknowledgebase);
	            }
	            else if(kmknowledgebase['kbtype'] === 'confluencelib' && kmknowledgebase['featurescript'])
	            {
	              try
                    {
                      eval('lib.'+kmknowledgebase.featurescript+'.applyKmKnowledgebaseDefaultValue(kmknowledgebase)');
                    }
                   catch(e)
                   {
                     logger.error('eval '+'lib.'+km.featurescript+'.applyKmKnowledgebaseDefaultValue(kmknowledgebase)' + ' meet error '+e);
                   }
	            }
	            kmknowledgebase.doUpdate();
	        }
            return token;
        } catch (e) {
            funcs.msg(funcs.scmsg('102', 'idol', [spUrl + param, e]), 3);
            return -1;
        }
    }

    function incrementalIndex(kmknowledgebase) {
        var spUrl = kmknowledgebase['spconnectorurl'];
        var spToken = kmknowledgebase['idoltoken'];
        var justFinishRestore = system.functions.nullsub(kmknowledgebase['needsynctoken'], true);
        var spTask = kmknowledgebase['sptask'];
        if(!justFinishRestore){
          var status = getSharePointStatus(spUrl, spToken);
          if (status !== lib.KMCollection_Status_Constant.INDEXSTATUS_FINISHED()) {
             return;
          }
        }
        
        var backupRet = backupConnector(spUrl, kmknowledgebase['lastbackuptime']);
        logger.info("connector backup result:" + backupRet);
        
        
        var param = 'action=Fetch&FetchAction=Synchronize&TaskSections=' + spTask + '&IngestActions=META:DREDBNAME=' + kmknowledgebase['kbname'] + ',META:ContentStore=GlobalSearch';
        if (((kmknowledgebase['kbtype'] === 'splib')||(kmknowledgebase['kbtype'] === 'confluencelib')) && !kmknowledgebase['no.security']) {
            param += ',META:SECURITYTYPE=SharePoint';
        }
        else if(kmknowledgebase['kbtype'] === 'okmlib' && kmknowledgebase['featurescript'])
        {
          try
          {
            var lua=eval('lib.'+kmknowledgebase['featurescript']+'.getOKMParseScriptName()');
            if(lua)
            {
               param += ',LUA:'+lua;
            }
          }
          catch(e)
          {
          }
        }
        try {
            logger.info("spUrl + param:" + spUrl + param);
            var response = lib.jsaci.runIDOLAction(spUrl + param, false);
            logger.info("response:" + response);
            var xml = new XML();
            xml.setContent(response);
            var token = xQuery.queryText('responsedata/token', xml);
            logger.info("token:" + token);
            var endDate = new Date();
            kmknowledgebase['lastindextime'] = endDate;
            kmknowledgebase['idoltoken'] = token;
            kmknowledgebase['needsynctoken'] = false;
            if(backupRet){
                kmknowledgebase['lastbackuptime'] = system.functions.tod();
            }            
            kmknowledgebase.doUpdate();
            return response;
        } catch (e) {
            funcs.msg(funcs.scmsg('102', 'idol', [spUrl + param, e]), 3);
            return response;
        }
    }
    
    function backupConnector( spUrl, lastBackupTime ) {
  	    var IDOLAdvancedSettings = lib.IDOLAdvancedSettings.require(); 
    	var settings = IDOLAdvancedSettings.GlobalSearch || {}
    	logger.info("connector daily backup folder:" + settings.CONNECTOR_DAILY_BACKUP_FOLDER);
    	logger.info("connector daily backup time:" + settings.CONNECTOR_DAILY_BACKUP_TIME);
    	logger.info("connector service url:" + spUrl);
    	
    	//check backup time
    	if(!checkExpire(settings.CONNECTOR_DAILY_BACKUP_TIME, lastBackupTime)){
    	   logger.info("the backup time is not match, skipped");
           return false;
    	}
    	
    	//check backup output folder path
    	if(!settings.CONNECTOR_DAILY_BACKUP_FOLDER){
    	   logger.info("the backup file output path is not set correctlly, skipped");
		   return false;
    	}
    	   	
		var backupFilePath = settings.CONNECTOR_DAILY_BACKUP_FOLDER;
		var param = 'action=BackupServer&path=' + backupFilePath;
	    var xQuery = lib.XQuery.require();
	    	
		try {
            var response = lib.jsaci.runIDOLAction(spUrl + param, false);
            var xml = new XML();
            logger.debug("response of backup connector: " + response);
            xml.setContent(response);
            var backupResult = xQuery.queryText('response', xml);
			if(backupResult && backupResult=="SUCCESS"){
				return true;
			}else{
				logger.error("backup connector meet exception, response is:" + response);
				return false;
			}

        } catch (e) {
            logger.error(e);
            return false;
        }
        
        return false;		
    }
    
  function checkExpire( scheduleTimeStr , lastBackupTime){   

    // if never perform backup, then should backup but must consider current time is meet scheduled backup time .
    if(!lastBackupTime){
      if(system.functions.time(system.functions.tod()) > system.functions.val(scheduleTimeStr,3)){
  	     return true;
  	  }else{
  	     return false;
  	  }
    }else{
      //if current time bigger thant scheduleTimeStr, and day of today is not equals day of lastBackupTime, then perform backup
      
      var strTod = system.functions.str(system.functions.tod());
      var mmddyy = strTod.split(" ")[0];
      var strWholeScheduleTime =mmddyy + " " + scheduleTimeStr + ":00";
      
      logger.info("connector backup time for this time check is: " + strWholeScheduleTime);
      
      if(system.functions.val(strTod, 3) > system.functions.val(strWholeScheduleTime,3)){
         var dayofToday           =  system.functions.day(system.functions.val(strTod,3));
         var dayofLastBackupTime  =  system.functions.day(system.functions.val(lastBackupTime,3));
         logger.info("day of Today: " + dayofToday + "," + "day of last backup time:" + dayofLastBackupTime);         
         if(dayofToday!= dayofLastBackupTime){
            return true;
         }else{
            return false;
         }
      }
    }
  }    

    function deleteATask(idolserverinfo, connectorURL, type) {
        for (var i = 0, j = idolserverinfo['other.urls'].length(); i < j; i++) {
            var connType = idolserverinfo['other.urls'][i]['type'];
            var connUrl = idolserverinfo['other.urls'][i]['url'];
            if (connType === type && connUrl === connectorURL) {
                idolserverinfo['other.urls'] = funcs._delete(idolserverinfo['other.urls'], i + 1, 1);
            }
        }
    }


    function autoUserMapping(kbname) {
        var knowledgebase = new SCFile('kmknowledgebase');
        var idolConfig = lib.IDOLConfigure.require().getConfig();
        var idolUrl = lib.IDOLConfigure.require().isInContainer() ? idolConfig['community.url'] : idolConfig['server.url'];
        var rc = knowledgebase.doSelect('kbname = "' + kbname + '"');
        ;
        if (rc !== RC_SUCCESS) {
            print('Cannot find kmknowledgebase: ' + kbname);
            return;
        }
        var fields = ['name', knowledgebase['mappingopproperty']];
        var operator = new SCFile('operator', SCFILE_READONLY);
        operator.setFields(fields);
        var query = knowledgebase['mappingquery'] == null ? 'true' : knowledgebase['mappingquery'];
        var rc = operator.doSelect(query);
        var ominGroup = lib.IDOL_Monitor.require().retrieveOMNIGroupServer();
        if (!ominGroup) {
            print('Cannot find OMNI Group Server');
            return;
        }

        var ominGroupUrl = 'http://' + ominGroup[0] + ':' + ominGroup[1] + '/';
        var count = 0;
        while (rc === RC_SUCCESS) {
            var name = operator['name'];
            //print(name);
            var opLdapName = operator[knowledgebase['mappingopproperty']];
            var domain = knowledgebase['mappingldapdomain'];

            //get user from OMNIGroup server
            var param = 'action=getallusers&Matching=' + domain + opLdapName;
            try {
                var response = lib.jsaci.runIDOLAction(ominGroupUrl + param, false);
            } catch (e) {
                print(funcs.scmsg('102', 'idol', [ominGroupUrl + param, e]), 3);
                continue;
            }

            var xml = new XML();
            xml.setContent(response);
            var resStatus = xQuery.queryText('response', xml);
            if (resStatus === 'SUCCESS') {
                var userCount = xQuery.queryText('responsedata/UserCount', xml);
                //if exist, call useradd in idol and create a user mapping in SharePointUserMapping
                if (Number(userCount) > 0) {
                    //call useradd
                    var ldapUserName = xQuery.queryText('responsedata/Users', xml);
                    param = 'action=useradd&username=' + ldapUserName + '&password=1&SecuritySharePointUsername=' + ldapUserName;
                    try {
                        response = lib.jsaci.runIDOLAction(idolUrl + param, false);
                    } catch (e) {
                        print(funcs.scmsg('102', 'idol', [idolUrl + param, e]), 3);
                        continue;
                    }

                    xml = new XML();
                    xml.setContent(response);
                    resStatus = xQuery.queryText('response', xml);
                    if (resStatus === 'SUCCESS') {
                        //insert a record in SharePointUserMapping
                        var rc = createUserMapping(name, ldapUserName, knowledgebase['kbname']);
                        if (rc !== RC_SUCCESS) {
                            print('Error when insert record to SharePointUserMapping');
                        }
                    } else {
                        print('Error when call getallusers. Request: ' + idolUrl + param + ' Response: ' + response);
                    }


                }
            } else {
                print('Error when call getallusers. Request: ' + ominGroupUrl + param + ' Response: ' + response);
            }
            count++;
            rc = operator.getNext();
        }
        print(count + ' operators are auto mapped');
    }

    function createUserMapping(operatorName, ldapName, repository) {
        var userMapping = new SCFile('SharePointUserMapping');
        userMapping['operator.name'] = operatorName;
        userMapping['sharepoint.name'] = ldapName;
        userMapping['sharepoint.repository'] = repository;
        userMapping['is.automatic'] = true;
        userMapping['create.time'] = new Date();
        userMapping['synchronized'] = true;
        userMapping['synchronize.time'] = new Date();
        return userMapping.doInsert();
    }


    function getSPTask(connurl) {
        var response = lib.IDOLRequest.require().doIDOLGet(connurl, {action: 'TaskList'});
        var result = [];
        var xQuery = lib.XQuery.require();
        var taskNodes = xQuery.query('responsedata/task', response);
        for (var i = 0, j = taskNodes.length; i < j; i++) {
            var action = xQuery.queryText('action', taskNodes[i]);
            if (action === 'SYNCHRONIZE') {
                result.push(xQuery.queryText('name', taskNodes[i]));
            }
        }
        return result;
    }

    function getSPConnServicePort(spConnUrl) {
        lib.IDOLRequest.require().doIDOLGet(spConnUrl, {action: 'getstatus'});

    }

    function getSPConnConfig(spConnUrl) {

        lib.IDOLRequest.require().doIDOLGet(spUrl, {action: 'Fetch', FetchAction: 'Synchronize', TaskSections: spTask});

    }

    function existUrl(url) {
        var sharepointUrls = getSharePointConfig(null, 'sharepoint')[0];
        for (var i = 0, j = sharepointUrls.length; i < j; i++) {
            if (sharepointUrls[i] === url) {
                return true;
            }
        }
        return false;
    }


    function createSchedule(kbname) {
        var schedule = new SCFile("schedule");
        schedule._class = "KMUpdate";


        var time = new Date();
        var sched = new Date(time.getTime() + 60);
        schedule.expiration = sched;

        schedule.name = "SharePoingUserMapping";
        schedule.javascript = "lib.IDOL_SharePoint.require().autoUserMapping('" + kbname + "')";

        if (schedule.doInsert() == RC_SUCCESS)
            return true;
        return false;

    }

    function getSecurityInfo(param) {
        var idolConfig = lib.IDOLConfigure.require().getConfig();
        var idolUrl = lib.IDOLConfigure.require().isInContainer() ? idolConfig['community.url'] : idolConfig['server.url'];
        var strPara = 'action=userread';
        for (var obj in param) {
            strPara += '&' + obj + '=' + param[obj];
        }
        var response = lib.jsaci.sendRequestToIDOL(idolUrl + strPara, '');
        var xml = new XML();
        xml.setContent(response);
        return xml;
    }

    function userExist(param) {
        var idolConfig = lib.IDOLConfigure.require().getConfig();
        var idolUrl = lib.IDOLConfigure.require().isInContainer() ? idolConfig['community.url'] : idolConfig['server.url'];
        var strPara = 'action=userexist';
        for (var obj in param) {
            strPara += '&' + obj + '=' + param[obj];
        }
        var response = lib.jsaci.sendRequestToIDOL(idolUrl + strPara, '');
        var xml = new XML();
        xml.setContent(response);

        var xQuery = lib.XQuery.require();
        var isExist = xQuery.queryText('responsedata/autn:userexists', xml);
        return isExist;
    }

    function userUpdate(userName, ntAccount, action) {
        var ret = RC_SUCCESS + 1;
        var idolConfig = lib.IDOLConfigure.require().getConfig();
        var idolUrl = lib.IDOLConfigure.require().isInContainer() ? idolConfig['community.url'] : idolConfig['server.url'];
        var strPara = 'action=' + action + '&username=' + userName + '&password=1&SecuritySharePointUsername=' + ntAccount;

        var response = lib.jsaci.sendRequestToIDOL(idolUrl + strPara, '');
        var xml = new XML();
        xml.setContent(response);

        xml = new XML();
        xml.setContent(response);
        var resStatus = xQuery.queryText('response', xml);
        if (resStatus === 'SUCCESS') {
            ret = RC_SUCCESS;
            //insert a record in SharePointUserMapping
            var rc = createUserMapping(userName, ntAccount, "");
            if (rc !== RC_SUCCESS) {
                print('Error when insert record to SharePointUserMapping');
            }
        }

        return ret;
    }

    function getOnlineSharePointUserName(omniUrl,opt){
        var ntAccount ="";
        var param ='action=GetAllUsers&Matching=*:'+opt['email'];
        var result = lib.jsaci.sendRequestToIDOL(omniUrl + param, '');
        if(result){
            var userXML =new XML();
            userXML.setContent(result);
            ntAccount =xQuery.queryText('responsedata/Users', userXML);
        }
        return ntAccount;
    }
    
    function retrieveOmniUserName(response,omniUrl,opt){
        var xml =  new XML();
        xml.setContent(response);
        var ntAccount="";
        var userCount = xQuery.queryText('responsedata/UserCount', xml);
        if(userCount == '0'){
            return getOnlineSharePointUserName(omniUrl,opt)
        }
        if(userCount == "1"){
            ntAccount = xQuery.queryText('responsedata/Users', xml);
        }else{
            var respdata = xQuery.queryOne('responsedata',xml);
            var  child_node = respdata.getFirstChildElement();

            while(child_node != null){
                var name = child_node.getNodeName();
                if(name =="Users"){
                    var userName =child_node.getNodeValue();
                    if(userName){
                        var param = 'action=GetUser&username='+userName;
                        var userResult = lib.jsaci.sendRequestToIDOL(omniUrl + param, '');
                        var userXML =new XML();
                        userXML.setContent(userResult);
                        var email = xQuery.queryText('responsedata/mail', userXML);
                        if(opt["email"]==email){
                            ntAccount = userName;
                            break;
                        }
                    }
                }
                child_node = child_node.getNextSiblingElement();
            }
        }

        return ntAccount;
    }
    
    function ntNameInOmniGroup( userName )
    {
        var ntAccount ="";
        var opt = new SCFile("operator",SCFILE_READONLY);
        var idolConfig = lib.IDOLConfigure.require().getConfig();

        var fields =[];
        var fieldName = idolConfig['sp.map.operator.prop'];
        fields.push(fieldName);
        if(fieldName !=='email'){fields.push('email');}
        opt.setFields(fields);
        var rc = opt.doSelect('name="'+userName+'"');
        var omniServer = lib.IDOL_Monitor.require().retrieveOMNIGroupServer();
        if(rc !== RC_SUCCESS || !omniServer){return ntAccount;}

        var omniUrl = 'http://' + omniServer[0] + ':' + omniServer[1] + '/';
        var param ='action=GetAllUsers&Matching=*'+opt[fieldName];
        var result = lib.jsaci.sendRequestToIDOL(omniUrl + param, '');
        if( !result){return ntAccount;}

        return retrieveOmniUserName(result,omniUrl,opt);

    }

    function getUrlTypeByKbtype(kbtype){
        if (kbtype === 'splib') {
            return 'sharepoint';
        }
        if (kbtype === 'weblib') {
            return 'http';
        }
        if (kbtype === 'fsyslib') {
            return 'filesystem'
        }
        if (kbtype === 'okmlib') {
            return 'okm'
        }
        if(kbtype == 'confluencelib')
        {
          return 'confluence';
        }
    }


    return {
        existUrl:existUrl,
        getSPTask:getSPTask,
        getSharePointConfig: getSharePointConfig,
        getSharePointConnectors: getSharePointConnectors,
        getTaskByConnector: getTaskByConnector,
        getSharePointStatus: getSharePointStatus,
        fullReindex: fullReindex,
        incrementalIndex: incrementalIndex,
        deleteATask: deleteATask,
        autoUserMapping: autoUserMapping,
        createSchedule: createSchedule,
        getSecurityInfo: getSecurityInfo,
        userExist:userExist,
        getNTAccount:ntNameInOmniGroup,
        userUpdate:userUpdate,
        getUrlTypeByKbtype: getUrlTypeByKbtype
    }


})();


function require() {
    return IDOL_SharePoint;
}