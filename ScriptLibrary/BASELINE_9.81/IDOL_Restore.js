var xQuery = lib.XQuery.require();
var IDOLConfigure = lib.IDOLConfigure.require();
var logger = getLog('IDOL_Restore');

function getIndexPort(url)
{
	var strurl = url + 'action=getStatus';
	var result =  lib.jsaci.sendRequestToIDOL(strurl, "");
 	if (result == null){
   		return null;
	}else{
		var xml = new XML();
		logger.info(result);
		xml.setContent(result);
		var port = xQuery.queryText('responsedata/indexport', xml);
		if (port) {
			return port;
		}
	}
}


function setNeedSyncCollectionFile( spurl )
{
	var collectionFile = new SCFile("kmknowledgebase");
	var sql = 'spconnectorurl="' + spurl +'"';
	logger.info("update collection sql:" + sql);
	var rc = collectionFile.doSelect(sql);
	
	while (rc == RC_SUCCESS) {
		logger.info("get collecitonfile:" + collectionFile);
		collectionFile["needsynctoken"] = true;
		collectionFile.doUpdate();
		rc = collectionFile.getNext();
	}
}


function getIndexStatus(url, actionid){
    var ret = 1;

	try{
		var result =  lib.jsaci.sendRequestToIDOL(url, "");
	 	if (result == null){
	   		return 3;
		}else{
			var xml = new XML();
			logger.info(result);
			xml.setContent(result);
			var items = xQuery.query('responsedata/item', xml);
			if (items) {	    
			    for(var i=0; i<items.length; i++){
			    	var indexCmd = xQuery.queryText('index_command', items[i]);
			    	if(indexCmd){		    		
			    		if(indexCmd.indexOf(actionid) > 0){
			    			var percentage_processed = xQuery.queryText('percentage_processed', items[i]);
			    			var status = xQuery.queryText('status', items[i]);		    					    			
			    			if(status == "-1"){
	              				ret = 2;
	      					} else if( status == "-7" || status == "-12" || status == "-13" || 
	      					           status == "-16" || status == "-17" || status == "-25" || 
	      					           status == "-34" || status == "-35" || status == "-36" || status == "-38"){
	      					    ret = 1;
	      					} else {
	      					    ret = 3;
	      					}
			    		}
			    	}
			    }
			}
		} 
	}catch(e) {
    	logger.error(e);
    }
	
	return ret;
}


function getThreadStatus(url, idolAction, actionid){
    var found = false;
    var ret = 1;
    
    try{
	    var requestUrl = url + idolAction;
		var result =  lib.jsaci.sendRequestToIDOL(requestUrl, "");
		if (result == null){
			return 3;
		}else{
			var xml = new XML();
			logger.info(result);
			xml.setContent(result);
			var items = xQuery.query('responsedata/autn:threads/autn:thread', xml);
			if (items) {
			    for(var i=0; i<items.length; i++){
			    	
			    	var node = items[i];
			    	
			    	if(node.getValue()== 'in progress'){
			    		var action_id = node.getAttributeValue("action_id");
			    		if(action_id == actionid){
			    		   found = true;
			    		}
			    	}
			    }
			}
		}
		
		if(!found){
			return getGPLStatus(url, "action=grl&format=xml&tail=100", actionid);
		}else{
			return 1;
		}
	}catch(e) {
    	logger.error(e);
    }
    
    return ret;
}

function getGPLStatus(url, idolAction, actionid){
    var ret = 1;
    
    try{
	    var requestUrl = url + idolAction;
		var result =  lib.jsaci.sendRequestToIDOL(requestUrl, "");
		
		if (result == null){
			return 3;
		}else{
			var xml = new XML();
			logger.info(result);
			xml.setContent(result);
			var items = xQuery.query('responsedata/logentry', xml);
			if (items) {
			    for(var i=0; i<items.length; i++){		    
			    	var action = xQuery.queryText('autn:action', items[i]);
			    	var request = xQuery.queryText('autn:request', items[i]);
			    	var status = xQuery.queryText('autn:status', items[i]);
			    	
			    	if(action == "RESTORESERVER" && request.indexOf(actionid)>0){
			    		if(status == "success"){
			    			return 2;
			    		}else{
			    			return 3;
			    		}
			    	}
			    }
			}
		}
	} catch(e) {
    	logger.error(e);
    }
    
    return ret;	
}


function getLocalizedDisplayRestoreStatusList(){
    vars['$idol.restore.jobstatus'] = [];
	vars['$idol.restore.jobstatus'].push("1");
	vars['$idol.restore.jobstatus'].push("2");
	vars['$idol.restore.jobstatus'].push("3");

    vars['$idol.restore.jobstatus.disp'] = [];
	vars['$idol.restore.jobstatus.disp'].push(funcs.scmsg("restore_status_1", "idol_restore"));
	vars['$idol.restore.jobstatus.disp'].push(funcs.scmsg("restore_status_2", "idol_restore"));
	vars['$idol.restore.jobstatus.disp'].push(funcs.scmsg("restore_status_3", "idol_restore"));
	
    vars['$tasktype.value'] = [];
    vars["$tasktype.value"].push("Restore Content");
    vars["$tasktype.value"].push("Restore Connector");


    vars['$tasktype.value.display'] = [];
    vars["$tasktype.value.display"].push(funcs.scmsg("task_type_restorecontent","idol_restore"));
    vars["$tasktype.value.display"].push(funcs.scmsg("task_type_restoreconnector","idol_restore"));	
}


function ValidFilePath(ParaValue){
  var ParaResult=0;
  var ParaMessage=" ";
  
  if(ParaValue==null || ParaValue=="")
  {	
	ParaResult=1;
	ParaMessage=funcs.scmsg("error_backup_file_path" ,"idol_restore");
  }
  
  var valid = lib.IDOL_Utilities.isValidFilePath(ParaValue);
  
  if(!valid){
  	ParaResult=1;
	ParaMessage=funcs.scmsg("error_backup_file_path" ,"idol_restore");
  }
  
  return {"result": ParaResult, "message": ParaMessage};
}

function ValidTime( ParaValue ) {
  var ParaResult=0;
  var ParaMessage=" ";
  
  if(ParaValue==null || ParaValue=="")
  {	
	return {"result": ParaResult, "message": ParaMessage};
  }
  
  var valid = false;
  
  var reg = /^\d+\d+:\d+\d+$/;
  if(reg.test(ParaValue)){
    var aTime = ParaValue.split(":");
    if(aTime.length !=2 ) {
       valid= false;
    }else{
       var hour = funcs.val(aTime[0],1);
       var min  = funcs.val(aTime[1],1);
       
       var hourRet = false;
       var minRet = false;
       
       if(hour || hour == 0){
         if(hour <= 23){
            hourRet =  true;
         }else{
            hourRet =  false;
         }
       }else{
          hourRet = false;
       }
                
       if(min || min == 0){
         if(min <= 59){
            minRet =  true;
         }else{
            minRet =  false;
         }
       }else{
          minRet =  false;
       }
       
       valid =  minRet && hourRet;
    }
  }else{
    valid =  false;
  }
  
  if(!valid){
  	ParaResult=1;
	ParaMessage=funcs.scmsg("error_backup_time_msg" ,"idol_restore");
  }
  
  return {"result": ParaResult, "message": ParaMessage};
}


function backupCategoryEntrance(){
  var backupFolder = lib.settings.getSettingValue("Smart Ticket", "st.backupfolder");
  var actionId = lib.UUID.generateUUID().toLowerCase();
  logger.info("backup Category:" + actionId);
  logger.info("backup Category:" + backupFolder);
  
  if(backupFolder){
  	var ret = backupCategory(getCategoryUrl(), actionId, backupFolder);
  	logger.info("backup Category:" + ret);
  }
}


function backupCategory( categoryUrl , actionid , backupPath){
  	
	var param = 'action=BackupServer&actionid='+actionid+'&path=' + backupPath;
	var xQuery = lib.XQuery.require();
	    	
	try {
       var response = lib.jsaci.runIDOLAction(categoryUrl + param, false);
       var xml = new XML();
       xml.setContent(response);
       var backupResult = xQuery.queryText('response', xml);
	   if(backupResult && backupResult=="SUCCESS"){
		  return true;
	   }else{
		  logger.error("backup category meet exception, response is:" + response);
		  return false;
	   }

    } catch (e) {
       if(e && e.indexOf("timed out")>0){
           logger.info("normal http socket time out exception, then wait backup server job finished.");
           var ret = waitBackupFinishedAndCheckResult( categoryUrl , actionid );
           return ret;
       }else{
       	   logger.error(e);
       	   return false;
       }
    }
    return false;	
}

function waitBackupFinishedAndCheckResult( categoryUrl, actionid ){
    var param = 'action=ThreadStatus';
    var retryTime = 0;
    
    while(true){
        var found = false;
	    try{
		    var requestUrl = categoryUrl + param;
			var result =  lib.jsaci.sendRequestToIDOL(requestUrl, "");
			if (result == null){
				return false;
			}else{
				var xml = new XML();
				logger.info(result);
				xml.setContent(result);
				var items = xQuery.query('responsedata/autn:threads/autn:thread', xml);
				if (items) {
				    for(var i=0; i<items.length; i++){
				    	var node = items[i];
				    	if(node.getValue()== 'in progress'){
				    		var action_id = node.getAttributeValue("action_id");
				    		if(action_id == actionid){
				    		   found = true;
				    		}
				    	}
				    }
				}
			}
			
			if(!found){
			    logger.info("Not found actionid:"+ actionid +" in thread status list, should be finished, need check GPL Status");
				return getGPLBackupServerStatus(categoryUrl, actionid);
			}
		}catch(e) {
	    	logger.error(e);
	    }
	    funcs.sleep(5);
	    retryTime ++ ;
	    
	    logger.info("To wait backup server finished, we has retried for : " + retryTime + " times, actionId:" + actionid);
	    
	    if(retryTime > 10){
	       break;
	    } 
	}
	
	return false;
}


function getGPLBackupServerStatus(url, actionid){
    var ret = false;
    var params = "action=grl&format=xml&tail=100";
    
    try{
	    var requestUrl = url + params;
		var result =  lib.jsaci.sendRequestToIDOL(requestUrl, "");
		
		if (result == null){
			ret = false;
		}else{
			var xml = new XML();
			//logger.info(result);
			xml.setContent(result);
			var items = xQuery.query('responsedata/logentry', xml);
			if (items) {
			    for(var i=0; i<items.length; i++){		    
			    	var action = xQuery.queryText('autn:action', items[i]);
			    	var request = xQuery.queryText('autn:request', items[i]);
			    	var status = xQuery.queryText('autn:status', items[i]);
		   	
			    	if(action == "BACKUPSERVER" && request.indexOf(actionid)>0){
			    	    logger.info("found backup server action:" + actionid + " has been finished with status:" + status);
			    		if(status == "success"){
			    			ret =  true;
			    		}else{
			    			ret =  false;
			    		}
			    		break;
			    	}
			    }
			}
		}
	} catch(e) {
    	logger.error(e);
    }
    
    return ret;	
}


function getCategoryUrl(){

    if(IDOLConfigure.isInContainer()){
    	return "http://smarta-st-proxy-svc:31410/";
    }
    
    
    var ret = "";
  	var idolserverinfo = lib.IDOL_Utilities.getIDOLServerConfig();  
  	
  	var mainProxyUrl = idolserverinfo['server.url'];  	
  	var param = "action=getStatus";
  	var url = mainProxyUrl + param;
  	var pos = mainProxyUrl.lastIndexOf(":");
  	var urlWithoutPort = mainProxyUrl.substr(0, pos);
  	
	try{
		var result =  lib.jsaci.sendRequestToIDOL(url, "");
	 	if (result == null){
	   		return "";
		}else{
			var xml = new XML();
			logger.info(result);
			xml.setContent(result);
			var item = xQuery.queryOne('responsedata/component/category', xml);
			if (item) {	    
	    		ret = urlWithoutPort + ":" + xQuery.queryText('aciport',item) + "/";
			}
		} 
	}catch(e) {
    	logger.error(e);
    }
    
    return ret;
}

function syncToken(spconnectorurl, sptask){
	var url = spconnectorurl + "action=QueueInfo&QueueAction=GetStatus&QueueName=Fetch&State=finished&Sort-By=finish-time&Sort-Order=descending&MaxResults=100&Start=1";

	try{
		var result =  lib.jsaci.sendRequestToIDOL(url, "");
	 	if (result == null){
	   		return null;
		}else{
			var xml = new XML();
			logger.info(result);
			xml.setContent(result);
			var items = xQuery.query('responsedata/actions/action', xml);
			if (items) {
			    for(var i=0; i<items.length; i++){
			    	var node = items[i];
			    	if(xQuery.queryText('tasksection', node) == sptask){
			    		return  xQuery.queryText('token', node);
			    	}
			    }
			}			
		} 
	}catch(e) {
    	logger.error(e);
    }
    
    return null;
}
