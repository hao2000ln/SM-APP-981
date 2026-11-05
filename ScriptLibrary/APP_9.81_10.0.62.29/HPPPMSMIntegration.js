function integratePPM(rfcId, retry)
{       
    var ppmInformation = getPPMInformation();
    
    if(ppmInformation != null)
    {
	    if(rfcId == null)
	    {	       
	       rfcId = vars.$L_file.number
	    }	    
	    var changem = new SCFile("cm3r");
	    var cmrc = changem.doSelect("number=\""+rfcId +"\"" );
	    if (cmrc == RC_SUCCESS)
	    { 
	        var xmlChangem = changem.getXML();  
	        var task = lib.HPSMPPMCommonLib.findTargetElement(xmlChangem,ppmInformation.taskidfield); 
	        if(task != null)
	        {
	            var taskId = task.getValue();
	            
			    var rfcStatus = changem.status;			     
			    var closureCode = changem.completion_code;
			    var updateDate = changem.sysmodtime;
			    var rfcLastUpdatedBy = changem.sysmoduser;
			    var closureMeaning = lib.ArrayUtil.toJsArray(changem.closing_comments);
			    if(!closureMeaning){
			    	closureMeaning = [];
			    }
			    ppmInformation.rfcId = rfcId;
			    ppmInformation.rfcStatus = rfcStatus;
			    ppmInformation.closureCode = closureCode;
			    ppmInformation.updateDate =  updateDate;
			    ppmInformation.rfcLastUpdatedBy = rfcLastUpdatedBy;
			    ppmInformation.closureMeaning = closureMeaning;					  	     
	            ppmInformation.taskId = taskId;
	            ppmInformation.retry = retry; 
	            
	            var updateRFCSuccess = updateRFC(ppmInformation)
	            if( updateRFCSuccess && rfcStatus == "closed")
	            {
	                 updateTask(ppmInformation);
	            }
	        }
	    }    
    }
}

function getPPMInformation()
{
	if(lib.SMPPMConfiguration.isEnabled()){
    	var ppmServer = new Object();
        ppmServer.taskidfield = lib.SMPPMConfiguration.getTaskIdField();  
        ppmServer.url= lib.SMPPMConfiguration.getPPMURL();
        ppmServer.username= lib.SMPPMConfiguration.getUsername();
        ppmServer.password= lib.SMPPMConfiguration.getPassword();
        ppmServer.connTimeOut = lib.SMPPMConfiguration.getConnTimeOut();
        ppmServer.sendTimeOut = lib.SMPPMConfiguration.getSendTimeOut();
        ppmServer.recvTimeOut = lib.SMPPMConfiguration.getRecTimeOut();
        return ppmServer
     }
     else
     {
         return null;
     }
}

function updateRFC(ppmInformation)
{
    try
	{
		print("Entering update RFC");    
                       
		var integrationService=new system.library.IntegrationService.IntegrationService();
		integrationService.user = ppmInformation.username;
		integrationService.password = ppmInformation.password;
		integrationService.location=ppmInformation.url+lib.SMPPMConfiguration.getPPMIntegrationServiceURI() + '?wsdl';
		integrationService.connectTimeOut = ppmInformation.connectTimeOut;
		integrationService.sendTimeOut = ppmInformation.sendTimeOut;
		integrationService.recvTimeOut = ppmInformation.recvTimeOut;
		
		var updateSMRfcRequest = new system.library.IntegrationService.updateSmRfc();
        var rfcId = ppmInformation.rfcId;
        var rfcStatus = ppmInformation.rfcStatus;
		var closureCode = ppmInformation.closureCode;
		var updateDate = ppmInformation.updateDate;
        var rfcLastUpdatedBy = ppmInformation.rfcLastUpdatedBy;
		var closureMeaning = ppmInformation.closureMeaning;					  	     
	    var taskId = ppmInformation.taskId;

        if(rfcStatus=="closed" || rfcStatus=="reopened")
        {
            var closecodes = vars.$G_cm_close_codes_desc;
            updateSMRfcRequest.updateSmRfc.rfcClosureCode=closecodes[closureCode-1];            
   	        	
	        var rfcClosureMeaning = closureMeaning.join('\r\n');
	        if(!rfcClosureMeaning){
	        	rfcClosureMeaning = '';
	        }
	        updateSMRfcRequest.updateSmRfc.rfcClosureMeaning = rfcClosureMeaning;
	        updateSMRfcRequest.updateSmRfc.$$minOccurs	= new Array();  
        }
        var rfcLastUpdateDate= new XMLDate(updateDate).getISODateTimeString();    
        
        updateSMRfcRequest.updateSmRfc.rfcId = rfcId;
        updateSMRfcRequest.updateSmRfc.rfcStatus = rfcStatus;  
        updateSMRfcRequest.updateSmRfc.rfcLastUpdatedBy = rfcLastUpdatedBy;
        updateSMRfcRequest.updateSmRfc.rfcLastUpdateDate = rfcLastUpdateDate;
        updateSMRfcRequest.updateSmRfc.taskId = taskId;       
     
		var updateSMRfcResponse = integrationService.invoke( updateSMRfcRequest );		
		if ( updateSMRfcResponse.isFault() )
		{
            print( updateSMRfcResponse.faultcode.getValue() );
            print( updateSMRfcResponse.faultstring.getValue() );
            print( updateSMRfcResponse.detail.getValue() );              
		    pushInQueue(ppmInformation,updateSMRfcResponse.faultstring.getValue());
            return(false);           
		}
		else 
		{  
		    removeFromQueue(ppmInformation);
			print("Update RFC finished")
   			return(true);
		}	   
	}
	catch( e )
	{
	    if(e!="TypeError: updateSMRfcResponse has no properties")
	    {
		    print( "Unable to update corresponding entity in PPM. The system will retry after sometime." );
		    pushInQueue(ppmInformation,e);
		    return false;
		}
		else
		{
		    removeFromQueue(ppmInformation);
		    return true;
		}
	}
}



function updateTask(ppmInformation)
{
    try
	{
	    print("Entering update task");		
	    
    	var projectService=new system.library.ProjectService.ProjectService();
    	projectService.user = ppmInformation.username;
		projectService.password = ppmInformation.password;
		projectService.location=ppmInformation.url+lib.SMPPMConfiguration.getPPMProjectServiceURI() + '?wsdl';
    	projectService.connectTimeOut = ppmInformation.connectTimeOut;
		projectService.sendTimeOut = ppmInformation.sendTimeOut;
		projectService.recvTimeOut = ppmInformation.recvTimeOut;
    	
        var updateTaskRequest = new system.library.ProjectService.UpdateTaskStatus(); 
        
		updateTaskRequest.taskId = ppmInformation.taskId;
		var rfcClosureCode  = ppmInformation.closureCode; 		
		if(rfcClosureCode != 4)
		{
		    updateTaskRequest.newStatus.setValue("completed");		   
		}
		else
		{
		    updateTaskRequest.newStatus.setValue("cancelled");
		}
		updateTaskRequest.ignoreSummaryTask=true;
		var projectServiceResponse = projectService.invoke( updateTaskRequest );	 
	    
		if ( projectServiceResponse.isFault() )
		{
            print( projectServiceResponse.faultcode.getValue() );
            print( projectServiceResponse.faultstring.getValue() );
            print( projectServiceResponse.detail.getValue() );              
	        pushInQueue(ppmInformation,projectServiceResponse.faultstring.getValue() );
            return("Failure");           
		}
		else 
		{  
		    removeFromQueue(ppmInformation);
			print("Update task finised")
   			return("Success");
		}	    
	}
	catch( e )
	{
	    if(e!="TypeError: projectServiceResponse has no properties")
	    {
	        print( "Unable to update corresponding entity in PPM. The system will retry after sometime." );
	        pushInQueue(ppmInformation, e);
	        return false;
	    }
		else
		{
		    removeFromQueue(ppmInformation);
		    return true;
		}		    
	}    	
}

function removeFromQueue(ppmInformation)
{
    var ppmFailoverQueue = new SCFile( "ppmFailoverQueue" );
    var findRecord = ppmFailoverQueue.doSelect("rfcid=\""+ppmInformation.rfcId+"\"" );	
    if ( findRecord == RC_SUCCESS )
    {
        ppmFailoverQueue.doRemove();
    }    
}

function pushInQueue(ppmInformation, exception)
{
	/*To decide whether add a new record*/
    var ppmFailoverQueue = new SCFile( "ppmFailoverQueue" );
    var findRecord = ppmFailoverQueue.doSelect("rfcid=\""+ppmInformation.rfcId+"\"" );	
    if ( findRecord == RC_SUCCESS )
    { 
        if(ppmInformation.retry == true)
        {
            var retryTimes = ppmFailoverQueue.retryTimes;
            if (retryTimes>0)
            {
               ppmFailoverQueue.retryTimes --;
               ppmFailoverQueue.doUpdate();  
            }
        }
        else
        {
            ppmFailoverQueue.retryTimes = 3;
	        ppmFailoverQueue.enqueueTime = new Date();
	        ppmFailoverQueue.exception = exception;	  
	        ppmFailoverQueue.doUpdate();          
        }        
	}
	else
	{
	    var queueLength = lib.HPSMPPMCommonLib.getTableLength("ppmFailoverQueue");
		var failOver = new SCFile("ppmFailoverQueue");	
		failOver.rfcid = ppmInformation.rfcId;		
		failOver.retryTimes = 3;
		failOver.enqueueTime = new Date();
		failOver.exception = exception;	
		failOver.id = queueLength+1;			
		var rc = failOver.doInsert();
		if ( rc != RC_SUCCESS )
		{
			print("Push failed updating in queue failed");
		}	  
	}
}

function ppmFailover()
{     
    var queueLength = lib.HPSMPPMCommonLib.getTableLength("ppmFailoverQueue");
    
    var ppmFailoverQueue = new SCFile( "ppmFailoverQueue" );
    var findRecord = ppmFailoverQueue.doSelect("true");	
    if ( findRecord == RC_SUCCESS )
    {
        while(queueLength>0)
        {
           if(ppmFailoverQueue.retryTimes >0)
           {
               handleRecord(ppmFailoverQueue);                             
           }
           findRecord = ppmFailoverQueue.getNext(); 
           queueLength--;
        }        
    }
}

function handleRecord(ppmFailoverQueue)
{
    var rfcId = ppmFailoverQueue.rfcid;
    integratePPM(rfcId, true);
}