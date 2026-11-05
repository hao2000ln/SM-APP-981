/****************************************************************
 *  Functions used in Line Item Approval integration with the   *
 *  old SM user interface                                       *
 *  Author: Beddy(guo.zou@hp.com)                               *
 *  Date:2010/04/23                                             *
 *  Version:1.0                                                 *
 ****************************************************************/

function buildApprovalInfoVar(lFilename, lId)
{
    var vDesc     = new Array();
    var vClass    = new Array();
    var vApprover = new Array();
    var vLevel    = new Array();
    var vStatus   = new Array();
    var vDateStr  = new Array();
    var vComments = new Array();
    var vTag      = new Array();
    var vSysmodtime = new Array();
    var vCount    = 0;
    
    // get class Request
    var fApproval = new SCFile("Approval");
    var fRlt1 = fApproval.doSelect("file.name=\"" + lFilename + "\" and unique.key=\"" + lId + "\"");
    while (fRlt1 == RC_SUCCESS)
    {
        var allStatusSize = system.functions.lng(fApproval.all_status);
        
        var classTmp = system.functions.scmsg(1,"others");
        if (classTmp.indexOf("Could not be found")>-1){
        	classTmp = "Request";
        }
        
        for (var i = 0; i < allStatusSize; i++)
        {
            // user blank string to show NULL
            vDesc.push(system.functions.nullsub(fApproval.all_status[i].desc,""));
            vClass.push(classTmp);
            vApprover.push(system.functions.nullsub(fApproval.all_status[i].approver,""));
            vLevel.push(system.functions.nullsub(fApproval.all_status[i].level,""));
            if((fApproval.approval_status == "pending" || fApproval.approval_status == "future") 
              && (fApproval.all_status[i].status == "Pending" || fApproval.all_status[i].status == "Future")){
                vCount = vCount+1;
            }
            //Localize approval status
            var tmpvStatus1 = system.functions.nullsub(fApproval.all_status[i].status,"");
            var tmpvStatus2 = system.functions.scmsg(tmpvStatus1,"global");
            if (tmpvStatus2.indexOf("Could not be found")>-1){
            	tmpvStatus2 = tmpvStatus1;
            }
            vStatus.push(tmpvStatus2);
            //End Localization
            vDateStr.push(system.functions.nullsub(system.functions.str(fApproval.all_status[i].date),""));
            vTag.push(lib.DBUtils.getTagByRecord(fApproval));
            vSysmodtime.push(system.functions.nullsub(system.functions.str(fApproval.sysmodtime),"")); 
        }
        
        // integrate comments
        buildNewComments(vComments, fApproval.comments, classTmp);
        
        fRlt1 = fApproval.getNext();
    }
    
    // get class Line Item and its components
    if (lFilename == "incidents") // only support table incidents
    {
        var fCartItem = new SCFile("svcCartItem");
        var fRlt2 = fCartItem.doSelect("sdID=\"" + lId + "\"");
        while (fRlt2 == RC_SUCCESS)
        {
            var fApprovalItem = new SCFile("Approval");
            var fRlt3 = fApprovalItem.doSelect("file.name=\"" + system.functions.filename(fCartItem) + 
                         "\" and unique.key=\"" + fCartItem.cartItemId + "\"");
            while (fRlt3 == RC_SUCCESS)
            {
                var classTmp = fApprovalItem.component;
                if (classTmp == null) classTmp = fCartItem.item_description;
                
                var allStatusSize = system.functions.lng(fApprovalItem.all_status);
		        for (var i = 0; i < allStatusSize; i++)
		        {
	                vDesc.push(system.functions.nullsub(fApprovalItem.all_status[i].desc,""));
		            vClass.push(classTmp);
		            vApprover.push(system.functions.nullsub(fApprovalItem.all_status[i].approver,""));
		            vLevel.push(system.functions.nullsub(fApprovalItem.all_status[i].level,""));
		            var tStatus = system.functions.nullsub(fApprovalItem.all_status[i].status,"");
		            if (fApprovalItem.approvals_record == false && tStatus == "Pending")
		            {
		                var tmpvStatus1 = "Future";
		            }
		            else
		            {
		                var tmpvStatus1 = tStatus;
		            }
		            
		            var tmpvStatus2 = system.functions.scmsg(tmpvStatus1,"global");
                    if (tmpvStatus2.indexOf("Could not be found")>-1){
                        tmpvStatus2 = tmpvStatus1;
                    }
                    vStatus.push(tmpvStatus2);
                    
		            vDateStr.push(system.functions.nullsub(system.functions.str(fApprovalItem.all_status[i].date),""));
		            vTag.push(lib.DBUtils.getTagByRecord(fApprovalItem));
		            vSysmodtime.push(system.functions.nullsub(system.functions.str(fApprovalItem.sysmodtime),""));
                    if((fApprovalItem.approval_status == "pending" || fApprovalItem.approval_status == "future") && 
                        (fApprovalItem.all_status[i].status == "Pending" || fApprovalItem.all_status[i].status == "Future")) {
                        vCount = vCount+1;
                    }   
	            }
	            
	            // integrate comments
                buildNewComments(vComments, fApprovalItem.comments, classTmp);
	            
	            fRlt3 = fApprovalItem.getNext();
            }
            
            fRlt2 = fCartItem.getNext();
        }
    }    
    
    // write back result
    vars.$L_pendingCount     = vCount;
    vars.$L_aplItem_desc     = vDesc;
    vars.$L_aplItem_class    = vClass;
    vars.$L_aplItem_approver = vApprover;
    vars.$L_aplItem_level    = vLevel;
    vars.$L_aplItem_status   = vStatus;	
    vars.$L_aplItem_date     = vDateStr;
    vars.$L_aplItem_comments = vComments;
    vars.$L_aplItem_tag      = vTag;
    vars.$L_aplItem_sysmodtime     = vSysmodtime;  
}

function buildApprovalLogVar(lFilename, lId)
{
    var vAction   = new Array();
    var vGroup    = new Array();
    var vOperator = new Array();
    var vDateStr  = new Array();
    var vPhase    = new Array();
    var vClass    = new Array();
    var vId = new Array();
    
    // get class Request
    var fApprovalLog = new SCFile("ApprovalLog");
    var fRlt1 = fApprovalLog.doSelect("file.name=\"" + lFilename + "\" and unique.key=\"" + lId + "\"");
    
    //get workflowName
    if (fRlt1 == RC_SUCCESS){
    	fRlt1 = fApprovalLog.getFirst();
    	var categoryValue = fApprovalLog.category;
    }
    var object = new SCFile("Object",SCFILE_READONLY);
    var query = "file.name=\""+lFilename+"\"";
    var obcRc1 = object.doSelect(query);
    var workflowName;
    if (obcRc1 == RC_SUCCESS){
    	var workflowLocation = object.workflowLocation;
    	var categoryFile = object.category_file_name;
    	if (workflowLocation == "category" && categoryFile != null){
    		var category = new SCFile( categoryFile ,SCFILE_READONLY);
    		sql = "name=\"" + categoryValue + "\"";
    		catRc1 = category.doSelect(sql);
    		if (catRc1 == RC_SUCCESS){
    			workflowName = category.workflow;
    		}
    	}
        else{
        	workflowName = object.workflow;
        }
    }
    
    while (fRlt1 == RC_SUCCESS)
    {
        var classTmp = "Request";
        
        //Localized Approve Action
        var tmpvAction1 = system.functions.nullsub(fApprovalLog.action,"");
        var tmpvAction2 = system.functions.scmsg(tmpvAction1,"global");
        if (tmpvAction2.indexOf("Could not be found")>-1){
        	tmpvAction2 = tmpvAction1;
        }
        vAction.push(tmpvAction2);
        //End localozation
        
        vGroup.push(system.functions.nullsub(fApprovalLog.group,""));
        vOperator.push(system.functions.nullsub(fApprovalLog.operator_fullname,""));
        vDateStr.push(system.functions.nullsub(system.functions.str(fApprovalLog.date),""));
        
        //Localized phase name
        if (workflowName == null){
        	vPhase.push(system.functions.nullsub(fApprovalLog.current_phase,""))
        }else{
	        var tmpMsgID = fApprovalLog.current_phase+";"+workflowName+";"+fApprovalLog.file_name;
	        var tmpPhase = system.functions.scmsg(tmpMsgID,"local:WorkflowPhase");
	        if (tmpPhase.indexOf("Could not be found")>-1){
	        	tmpPhase = system.functions.nullsub(fApprovalLog.current_phase,"");
	        }
	        vPhase.push(tmpPhase);
        }
        //End localzation
        
        vClass.push(classTmp);
        vId.push(system.functions.nullsub(fApprovalLog.counter,""));
        fRlt1 = fApprovalLog.getNext();
    }
    
    // get class Line Item and its components
    if (lFilename == "incidents") // just support table incidents
    {
        var fCartItem = new SCFile("svcCartItem");
        var fRlt2 = fCartItem.doSelect("sdID=\"" + lId + "\"");
        while (fRlt2 == RC_SUCCESS)
        {
            var fApprovalItemLog = new SCFile("ApprovalLog");
            var fRlt3 = fApprovalItemLog.doSelect("file.name=\"" + system.functions.filename(fCartItem) + 
                         "\" and unique.key=\"" + fCartItem.cartItemId + "\"");
            while (fRlt3 == RC_SUCCESS)
            {
                var classTmp = fCartItem.item_description;
                var fApprovalItem = new SCFile("Approval");
                var fRlt4 = fApprovalItem.doSelect("file.name=\"" + fApprovalItemLog.file_name + 
                             "\" and unique.key=\"" + fApprovalItemLog.unique_key + "\" and name=\"" + 
                             fApprovalItemLog.name + "\" and component=\"" + fApprovalItemLog.component + "\"");
                if (fRlt4 == RC_SUCCESS)
                {
                    if (fApprovalItem.component != null) classTmp = fApprovalItem.component;
                }
                var tmpvAction1 = system.functions.nullsub(fApprovalItemLog.action,"");
                var tmpvAction2 = system.functions.scmsg(tmpvAction1,"global");
                if (tmpvAction2.indexOf("Could not be found")>-1){
                    tmpvAction2 = tmpvAction1;
                }       
                vAction.push(tmpvAction2);
		        vGroup.push(system.functions.nullsub(fApprovalItemLog.group,""));
		        vOperator.push(system.functions.nullsub(fApprovalItemLog.operator_fullname,""));
		        vDateStr.push(system.functions.nullsub(system.functions.str(fApprovalItemLog.date),""));
		        vPhase.push(system.functions.nullsub(fApprovalItemLog.current_phase,""));
		        vClass.push(classTmp);
	            vId.push(system.functions.nullsub(fApprovalItemLog.counter,""));
	            fRlt3 = fApprovalItemLog.getNext();
            }
            
            fRlt2 = fCartItem.getNext();
        }
    }
    
    // write back result
    vars.$L_aplLog_action            = vAction;
    vars.$L_aplLog_group             = vGroup;
    vars.$L_aplLog_operator_fullname = vOperator;
    vars.$L_aplLog_date              = vDateStr;
    vars.$L_aplLog_current_phase     = vPhase;
    vars.$L_aplLog_class             = vClass;
    vars.$L_aplLog_id                = vId;
}

function getComponentNameFromPath(lPath)
{
    var tag = getComponentTagFromPath(lPath);
    var idx = tag.indexOf(";");
    var name = tag.substr(idx + 1);
    
    return name;
}

function getComponentTagFromPath(lPath)
{
    var path = system.functions.denull(lPath);
    var pathSize = system.functions.lng(path);
    var tag = path[pathSize - 1];
    
    return tag;
}

function buildNewComments(lNewComments, lOldComments, lClassName)
{
    var oldCommentsDenullSize = system.functions.lng(system.functions.denull(lOldComments));
    if (oldCommentsDenullSize > 0)
    {
        var oldCommentsSize = system.functions.lng(lOldComments);
        for (var i = 0; i < oldCommentsSize; i++)
        {
            if (i % 2 == 0) // time
            {
                lNewComments.push(system.functions.nullsub(lOldComments[i],"") + " <" + lClassName + ">");
            }
            else            // comments
            {
                lNewComments.push(system.functions.nullsub(lOldComments[i],""));
            }
        }
    }
}

function isComponentPathEmpty(lComponentPath)
{
    var componentPathSize = system.functions.lng(system.functions.denull(lComponentPath));
    
    if (componentPathSize == 0)
        return true;
    else
        return false;
}