/****************************************************************
 *  Functions used in Line Item Approval generated and delete   *
 *                                                              *
 *  Author: Beddy(gzou@hp.com)                                  *
 *  Date:2010/03/31                                             *
 *  Update: 2010/12/25                                          *
 *  Version:1.2                                                 *
 ****************************************************************/
 
 /**QCCR1E101238, SM934, dengxin
  **add readonly for doselect, and add the selected fields
  **getLevelApprovalStatus, apply for fApproval 
  **getApprovalStatus, apply for fsvcCartItem, fsvcCartItems, fApproval, fApprovals
  **updateItemApprovalRecordFromRequest, apply for fCartItem
  */

// Return the request final approval status by use given new status
function getApprovalStatus(lFileName, lId, lNewStatus)
{
    var finalStatus = lNewStatus;
    var allStatus = [];
    allStatus.push(lNewStatus);
    
    var fsvcCartItem;
    var fApproval;
    var fRlt;
    var fRlt2;
    
    if (lFileName == "incidents")
    {
        fsvcCartItem = new SCFile("svcCartItem",SCFILE_READONLY);
    	fsvcCartItem.setFields("cartItemId");
        var fSql = "sdID=\"" + lId + "\"";
        fRlt = fsvcCartItem.doSelect(fSql);
        while(fRlt == RC_SUCCESS)
        {
            fApproval = new SCFile("Approval",SCFILE_READONLY);
    		fApproval.setFields("approval.status");
            fRlt2 = fApproval.doSelect("file.name=\"svcCartItem\" and unique.key=\"" + fsvcCartItem.cartItemId + "\"");
            while (fRlt2 == RC_SUCCESS)
            {
                allStatus.push(fApproval.approval_status);
                
                fRlt2 = fApproval.getNext();
            }
            
            fRlt = fsvcCartItem.getNext();
        }
    }
    else if (lFileName == "svcCartItem")
    {
        fsvcCartItem = new SCFile("svcCartItem",SCFILE_READONLY);
    	fsvcCartItem.setFields("sdID");
        fRlt = fsvcCartItem.doSelect("cartItemId=\"" + lId + "\"");
        if (fRlt == RC_SUCCESS)
        {
            fApproval = new SCFile("Approval",SCFILE_READONLY);
    		fApproval.setFields("approval.status");
            fRlt2 = fApproval.doSelect("file.name=\"incidents\" and unique.key=\"" + fsvcCartItem.sdID + "\"");
            if (fRlt2 == RC_SUCCESS)
            {
                allStatus.push(fApproval.approval_status);
            }
            
            var fsvcCartItems = new SCFile("svcCartItem",SCFILE_READONLY);
    		fsvcCartItems.setFields("cartItemId");
            var fRlt3 = fsvcCartItems.doSelect("sdID=\"" + fsvcCartItem.sdID + "\" and cartItemId~=\"" + lId + "\"");

            while (fRlt3 == RC_SUCCESS)
            {
                var fApprovals = new SCFile("Approval",SCFILE_READONLY);
    			fApprovals.setFields("approval.status");
                var fRlt4 = fApprovals.doSelect("file.name=\"svcCartItem\" and unique.key=\"" + fsvcCartItems.cartItemId + "\"");
                while (fRlt4 == RC_SUCCESS)
                {
                    allStatus.push(fApprovals.approval_status);
                    
                    fRlt4 = fApprovals.getNext();
                }
                
                fRlt3 = fsvcCartItems.getNext();
            }
        }
    }
    
    finalStatus = getFinalStatus(allStatus);
    return finalStatus;
}

// According to the approval status array, get the final approval status
function getFinalStatus(lAllStatus)
{
    var finalStatus = "approved";
    // input object size
    var Len = funcs.lng(lAllStatus); //if (lAllStatus.constructor == Array)
    
    // calc final status
    var i;
    for (i = 0; i < Len; i++)
    {
        if (lAllStatus[i] == "approved")
        {
            continue;
        }
        else if (lAllStatus[i] == "denied" || finalStatus == "denied")
        {
            finalStatus = "denied";
            break;
        }
        else if (lAllStatus[i] == "pending" && finalStatus != "denied")
        {
            finalStatus = "pending";
        }
        
    }
    
    return finalStatus;
}

// According to the reuquest's approval status, automatic update the Line Item Approval's state
function setItemApprovalRecord(lFile)
{
    var tState = true;
    if (lFile.open == "Closed") {
        tState = false;
    }
    
    updateItemApprovalRecordFromRequest(lFile.incident_id, tState);
}

// Delete all Line Item Approvals belong to the given request
function deleteLineItemApproval(lReqId)
{
    var allCartItem = [];
    
    var fCartItem = new SCFile("svcCartItem", SCFILE_READONLY);
    fCartItem.setFields(["cartItemId"]);
    var fSql = "sdID=\"" + lReqId + "\"";
    var fRlt = fCartItem.doSelect(fSql);
    while(fRlt == RC_SUCCESS)
    {
        allCartItem.push(funcs.str(fCartItem.cartItemId));
        
        fRlt = fCartItem.getNext();
    }

    if (allCartItem.length > 0)
    {
        var aplSql = "file.name=\"svcCartItem\" and unique.key isin " + funcs.str(allCartItem);
        var fApproval = new SCFile("Approval");
        var aplRlt = fApproval.doSelect(aplSql);
        while(aplRlt == RC_SUCCESS)
        {
            fApproval.doDelete();
            
            aplRlt = fApproval.getNext();
        }
    }

}

// After update the request level approval status, call this function to update the Line Item Approval's visible state
function updateItemApprovalRecordFromRequest(lReqId, lState)
{
    var reqApprovalStatus = getLevelApprovalStatus("incidents", lReqId);

    // if request level not approved, set line item level invisible
    if (lState && reqApprovalStatus != "approved")
    {
        lState = false;
    }
    
    // update all related item approval.record
    var fCartItem = new SCFile("svcCartItem",SCFILE_READONLY);
    fCartItem.setFields("cartItemId");
	var rlt = fCartItem.doSelect("sdID=\"" + lReqId + "\"");
	while (rlt == RC_SUCCESS)
	{
	    var fCartItemTag = lib.DBUtils.getTagByRecord(fCartItem);
	    var fItemApproval = new SCFile("Approval");
	    var rlt2 = fItemApproval.doSelect("file.name=\"svcCartItem\" and unique.key=\"" + fCartItem.cartItemId + "\" and approval.status=\"pending\"");
	    while (rlt2 == RC_SUCCESS)
	    {
	        var bContinue = true;
	     
            if (reqApprovalStatus == "approved" && fItemApproval.approvals_record == false && lState == true)
            {
                bContinue = true;
            }
            else
            {
                // skip for remained Approval record
		        var fBackup = new SCFile("ApprovalSourceBackup", SCFILE_READONLY);
		        fBackup.setFields(["related.approval.state"]);
		        var backupTag = fCartItemTag;
		        if (fItemApproval.component != null)
		        {
		            backupTag += ";" + fItemApproval.component;
		        }
		        if (fBackup.doSelect("tag=\"" + backupTag + "\"") == RC_SUCCESS)
		        {
		            if (fBackup.related_approval_state == "remain")
		            {
		                bContinue = false;
		            }
		        }
            }
	        
	        if (bContinue)
	        {
	            var oldState = fItemApproval.approvals_record != null ? fItemApproval.approvals_record : false;
	            
		        fItemApproval.approvals_record = lState;
		        
		        var ret;
		        funcs.rtecall("trigger", ret, 0);
		        if (fItemApproval.doUpdate() == RC_SUCCESS)
		        {
		            // if approvals.record changed, call notification
		            //Start: Added for New Portal Notification coz here trigger cannot be fired
		            if (lib.PortalNotification){
		                lib.PortalNotification.convertToPortalNotification('', fItemApproval, fItemApproval);
		            }
		            //End
		            if (oldState != lState) {
		                doLineItemAddNofity(fItemApproval, oldState);
		            }
		        }
		        funcs.rtecall("trigger", ret, 1);
	        }
	        
	        rlt2 = fItemApproval.getNext();
	    }
	
	    rlt = fCartItem.getNext(); 
	}
}

// Run add notify for one Approval record defined in Approval object
function doLineItemAddNofity(lFile, lOldState)
{
    var obj = new SCFile("Object", SCFILE_READONLY);
    obj.setFields(["notification.add"]);
    if (obj.doSelect("file.name=\"Approval\"") == RC_SUCCESS)
    {
        if (obj['notification.add'] != null)
        {
            lib.ScAPI_RAD.us_notify(obj['notification.add'], lFile, [lOldState]);
        }
    }
}

// Check to see if the compoent name was used before
function isDuplicateComponent(lSvcCartItem, lPathIdentify)
{
    var bDuplicate = false;
    var componentTag = lib.DBUtils.getTagByRecord(lSvcCartItem) + ";" + lSvcCartItem.item_description;
    var backupRecord = new SCFile("ApprovalSourceBackup", SCFILE_READONLY);
    backupRecord.setFields(["identify"]);
    var query = "tag=\"" + lib.Utilities.escstr(componentTag) + "\"";
    if (backupRecord.doSelect(query) == RC_SUCCESS)
    {
        if (funcs.str(lPathIdentify) != backupRecord.identify)
	    {
	        bDuplicate = true;
	    }
    }
    
    return bDuplicate;
}

// Check a cart item file or its component changed or not
function isCartItemChanged(lSvcCartItem, lbComponent)
{
    // Define the checked field name
    var checkFileds = "options,bundle.options,requested.for,requested.for.type,requested.for.dept,requested.for.fullname," +
                       "quantity,cost,unit.cost,option.costs,delivery,agreement.id,serviceSLA,sdID,svcCatalogId,cartId," +
                       "requested.by,request.time";
		    
    var bChanged = true;
    var bContinue = true;
    
    // Search out the backup data, and compare whether they are the same
    if (bContinue)
    {
        var tag = funcs.filename(lSvcCartItem) + ";" + lSvcCartItem.cartItemId;
        if (lbComponent) {
            tag += ";" + lSvcCartItem.item_description;
        }
        var backupSql = "tag=\"" + tag + "\"";
	    var backupFile = new SCFile("ApprovalSourceBackup");
	    if (backupFile.doSelect(backupSql) == RC_SUCCESS)
	    {
		    var backupData = new XML();
		    if (backupData.setContent(backupFile.source_backup))
		    {
		        var instanceNode = backupData.getFirstChildElement();
		        while (instanceNode != null && instanceNode.getNodeName() != "instance")
		        {
		            instanceNode = instanceNode.getNextSiblingElement();
		        }
		        
		        if (instanceNode != null)
		        {
		            var valueNode = instanceNode.getFirstChildElement();
		            while (valueNode != null)
		            {
		                var nodeName = valueNode.getName();
		                if (checkFileds.indexOf(nodeName) > -1)
		                {
		                    var nodeText = valueNode.getText();
		                    var recordText = funcs.str(lSvcCartItem[nodeName]);
		                    if (nodeText != recordText)
		                    {
		                        bChanged = true;
		                        break;
		                    }
		                    else
		                    {
		                        bChanged = false;
		                    }
		                }
		                
		                valueNode = valueNode.getNextSiblingElement();
		            }
		        }
		    }
	    }
    }
        
    return bChanged;
}

// Delete dirty line item approval records
function deleteDirtyApprovalItemRecord(lReqTag)
{
    var sdId = lReqTag.substr(lReqTag.indexOf(";")+1);
    var asb = new SCFile("ApprovalSourceBackup");
    var rlt = asb.doSelect("parent.tag=\"" + lReqTag + "\"");
    while (rlt == RC_SUCCESS)
    {
        var tableName = lib.DBUtils.getFilenameByTag(asb.tag);
        var uniqueKey = lReqTag.substr(tableName.length + 1);
        var fApprovalSql;
        var fApproval;
        var fRlt;
        
        var sql = lib.DBUtils.getQueryByTag(asb.tag);
        var rcd = new SCFile(tableName);
        if (rcd.doSelect(sql) != RC_SUCCESS)
        {
            asb.doDelete();

            fApprovalSql = "file.name=\"" + tableName + "\" and unique.key=\"" + uniqueKey + "\"";
            fApproval = new SCFile("Approval");
            fRlt = fApproval.doSelect(fApprovalSql);
            while (fRlt == RC_SUCCESS)
            {
                fApproval.doDelete();
                
                fRlt = fApproval.getNext();
            }
        }
        else // Check for the corresponding component dirty approval records
        {
            if (rcd.bundle)
            {
                var allComponents = getAllComponents(rcd);
                var asbComponent = new SCFile("ApprovalSourceBackup");
	            var rlt2 = asbComponent.doSelect("parent.tag=\"" + asb.tag + "\"");
	            while (rlt2 == RC_SUCCESS)
	            {
	                var componentName = lib.Utilities.getElementFromTag(asbComponent.tag, 2);
	                if (funcs.index(componentName, allComponents) < 1)
	                {
	                    asbComponent.doDelete();
	                    
	                    fApprovalSql = "file.name=\"svcCartItem\" and unique.key=\"" + rcd.cartItemId + 
		                                       "\" and component=\"" + componentName + "\"";
			            fApproval = new SCFile("Approval");
			            fRlt = fApproval.doSelect(fApprovalSql);
			            while (fRlt == RC_SUCCESS)
			            {
			                fApproval.doDelete();
			                
			                fRlt = fApproval.getNext();
			            }
	                }

	                rlt2 = asbComponent.getNext();
	            }
            }
        }
        
        rlt = asb.getNext();
    }
}

// Return a no duplicate data array from given array
function noDuplicateArray(lArr)
{
    var rtnArr = [];
    if (lArr)
    {
        var i;
        for (i = 0; i < lArr.length; i++)
        {
            if (rtnArr != null)
            {
                var bNotFind = true;
                var j;
                for (j = 0; j < rtnArr.length; j++)
                {
                    if (rtnArr[j] == lArr[i]) {
                        bNotFind = false;
                    }
                }
                
                if (bNotFind)
                {
                    rtnArr.push(lArr[i]);
                }
            }
            else
            {
                rtnArr.push(lArr[i]);
            }
        }
    }
    
    return rtnArr;
}

// Get all the components name array of a cart item file, this is a recursive function
function getAllComponents(lSvcCartItem)
{
    var components = [];
    var fCatalog = new SCFile("svcCatalog");
    var fSql = "name=\"" + lSvcCartItem.item_description + "\"";
    if (fCatalog.doSelect(fSql) == RC_SUCCESS)
    {
        if (fCatalog.type == "bundle")
        {
            var BundleLen = funcs.lng(funcs.denull(fCatalog.bundle));
            var i;
            for (i = 0; i < BundleLen; i++)
            {
                var itemName = fCatalog.bundle[i].item_name;
                if (beComponentSelected(fCatalog, lSvcCartItem, i + 1))
                {
                    components.push(itemName);
                }
                
                // check for its sub
                var fSubCatalog = new SCFile("svcCatalog", SCFILE_READONLY);
                fSubCatalog.setFields(["type","item.approvals.import"]);
                if (fSubCatalog.doSelect("name=\"" + itemName + "\"") == RC_SUCCESS)
                {
                    if (fSubCatalog.type == "bundle" && fSubCatalog.item_approvals_import)
                    {
                        var fMemFile = memeoryCartItem(lSvcCartItem, itemName);
                        var subComponent = getAllComponents(fMemFile);
                        if (subComponent != null)
                        {
                            var j;
	                        for (j = 0; j < subComponent.length; j++)
	                        {
	                            components.push(subComponent[j]);
	                        }
                        }
                    }
                }
            }
        }
    }
    
    return noDuplicateArray(components);
}


// Register the approval state by tag, use to check remain
function setBackupState(lTag, lState, lPath)
{
    if (lState) {
        lState = "remain";
    }
    
    var backupRecord = new SCFile("ApprovalSourceBackup");
    if (backupRecord.doSelect("tag=\"" + lTag + "\"") == RC_SUCCESS)
    {
        if (lPath)
	    {
	        if (funcs.str(lPath) != backupRecord.identify)
	        {
	            return true;
	        }
	    }
        backupRecord.related_approval_state = lState;
        
        if (backupRecord.doUpdate() == RC_SUCCESS) {
            return true;
        }
    }
    
    return false;
}

// Backup svcCartItem file data
function backupCartItem(lSvcCartItem)
{
    var tag = lib.DBUtils.getTagByRecord(lSvcCartItem);
    var parentTag = "incidents;" + lSvcCartItem.sdID;
    var backupRecord = new SCFile("ApprovalSourceBackup");
    if (backupRecord.doSelect("tag=\"" + tag + "\"") == RC_SUCCESS)
    {
        backupRecord.parent_tag = parentTag;
        backupRecord.source_format = "xml_record";
        backupRecord.source_backup = lSvcCartItem.getXML().toXMLString();
        backupRecord.related_approval_state = "generate";
        
        backupRecord.doUpdate();
    }
    else
    {
        backupRecord.tag = tag;
        backupRecord.parent_tag = parentTag;
        backupRecord.source_format = "xml_record";
        backupRecord.source_backup = lSvcCartItem.getXML().toXMLString();
        backupRecord.related_approval_state = "generate";
        
        backupRecord.doInsert();
    }
}

// Backup Component file data (comes from memory)
function backupComponent(lComponent, lIdentify)
{
    var parentTag = lib.DBUtils.getTagByRecord(lComponent);
    var tag = parentTag + ";" + lComponent.item_description;
    var identifyStr = funcs.str(lIdentify);
    var backupRecord = new SCFile("ApprovalSourceBackup");
    if (backupRecord.doSelect("tag=\"" + tag + "\"") == RC_SUCCESS)
    {
        backupRecord.parent_tag    = parentTag;
        backupRecord.source_format = "xml_record";
        backupRecord.source_backup = lComponent.getXML().toXMLString();
        backupRecord.identify      = identifyStr;
        backupRecord.related_approval_state = "generate";
        
        backupRecord.doUpdate();
    }
    else
    {
        backupRecord.tag           = tag;
        backupRecord.parent_tag    = parentTag;
        backupRecord.source_format = "xml_record";
        backupRecord.source_backup = lComponent.getXML().toXMLString();
        backupRecord.identify      = identifyStr;
        backupRecord.related_approval_state = "generate";
        
        backupRecord.doInsert();
    }
}

// Return the final approval status of the specified level (lType: all, master, allcomponent, onecomponent)
function getLevelApprovalStatus(lFilename, lId, lType, lName)
{
    var levelApprovalStatusArray = [];
    
    var fApproval = new SCFile("Approval",SCFILE_READONLY);
    fApproval.setFields("approval.status");
    var fSql = "file.name=\"" + lFilename + "\" and unique.key=\"" + lId + "\"";
    
    if (lType == "master") {
        fSql += " and component=NULL";
    }
    else if (lType == "allcomponent") {
        fSql += " and component<>NULL";
    }
    else if (lType == "onecomponent") {
        fSql += " and component=\"" + lName + "\"";
    }
    
    var fRlt = fApproval.doSelect(fSql);
    while (fRlt == RC_SUCCESS)
    {
        levelApprovalStatusArray.push(fApproval.approval_status);
        
        fRlt = fApproval.getNext();
    }
    
    
    var levelApprovalStatus = "approved";
    if (levelApprovalStatusArray.length > 0)
    {
        levelApprovalStatus = getFinalStatus(levelApprovalStatusArray);
    }
    
    return levelApprovalStatus;
}

// According to the paramenter options xml string to check whether a Component been selected
function isComponentSelected(lCartItem, lI) // lI start at 1
{
    var fCatalog = new SCFile("svcCatalog");
    var sql = "name=\"" + lCartItem.item_description + "\"";
    if (fCatalog.doSelect(sql) == RC_SUCCESS)
    {
        return beComponentSelected(fCatalog, lCartItem, lI);
    }
    else
    {
        var rtn = lib.svcCatBundles.isSelected(lCartItem.options, "opt" + lI);
        var bRtn = funcs.nullsub(funcs.val(rtn, 4), false);
        return bRtn;
    }
}


// According to the paramenter options xml string to check whether a Component been selected, need svcCatalog file here
function beComponentSelected(lSvcCatalog, lCartItem, lI) // lI start at 1
{
    var beSelected = false;
    var componentSize = funcs.lng(funcs.denull(lSvcCatalog.bundle));
    if (lI > 0 && lI <= componentSize)
    {
	    var type = lSvcCatalog.bundle[lI - 1].item_option;

	    if (type == "mandatory")
	    {
	        beSelected = true;
	    }
	    else
	    {
	        var optionXML = new XML();
	        if (optionXML.setContent(lCartItem.options))
	        {
	            var optXML = lib.xmlHelpers.getElement(optionXML, "opt" + lI, "id");
	            if (optXML != null)
	            {
	                var text = optXML.getText();
	                beSelected = funcs.nullsub(funcs.val(text, 4), false);
	            }
	        }
	    }
    }
    
    return beSelected;
}

// Build memory cartItem file by given component name
function memeoryCartItem(lCartItemFile, lCatalogName)
{
    var file = new SCFile("svcCartItem");
    if (lCatalogName == null)
    {
        funcs.fduplicate(file, lCartItemFile);
        return file;
    }
    
    // Build important fields
    file.sdID       = lCartItemFile.sdID;
    file.cartId     = lCartItemFile.cartId;
    file.cartItemId = lCartItemFile.cartItemId;
    
    if (lCartItemFile.bundle && !lCartItemFile.completed)
    {
        var sql = "name=\"" + lCartItemFile.item_description + "\"";
        var catalog = new SCFile("svcCatalog", SCFILE_READONLY);
        catalog.setFields(["type", "bundle"]);
        if (catalog.doSelect(sql) == RC_SUCCESS)
        {
            if (catalog.type == "bundle")
            {
                var itemSize = funcs.lng(catalog.bundle);
                var subCatalogId = -1;
                var i;
                for (i = 0; i < itemSize; i++)
                {
                    if (catalog.bundle[i].item_name == lCatalogName)
                    {
                        subCatalogId = i;
                        break;
                    }
                }

                if (subCatalogId > -1 && isComponentSelected(lCartItemFile, subCatalogId + 1))
                {
                    var subSql = "name=\"" + lCatalogName + "\"";
                    var subCatalog = new SCFile("svcCatalog");
                    if (subCatalog.doSelect(subSql) == RC_SUCCESS)
                    {
                        var subOpt = "opt" + (subCatalogId + 1);
                        file.serviceSLA       = lCartItemFile.serviceSLA;
                        file.requested_for    = lCartItemFile.requested_for;
                        file.requested_for_fullname = lCartItemFile.requested_for_fullname;
                        file.sysmodtime       = funcs.tod();
                        file.sysmodcount      = 1;
                        file.completed        = false;
                        file.svcCatalogId     = funcs.val(subCatalog.id, 1);
                        file.item_description = subCatalog.name;
                        file.request_time     = null;
                        file.start_time       = null;
                        file.agreement_id     = null;
                        file.bundle           = subCatalog.type == "bundle";
                        file.subscription     = subCatalog.createSubscription;
                        file.subscriptionItem = subCatalog.subscriptionItem;
                        file.status           = "Requested";
                        file.cost             = null;
                        file.unit_cost        = null;
                        file.option_costs     = null;
                        file.quantity         = funcs.nullsub(catalog.bundle[subCatalogId].item_quantity, 1) 
                                                * funcs.nullsub(lCartItemFile.quantity, 1);
                        if (file.bundle)
                        {
                            var options  = lib.svcCatBundles.getSubBundle(lCartItemFile.bundle_options, subOpt);
                            file.options = lib.svcCatBundles.getForm(lCartItemFile.bundle_options, subOpt, subCatalog);
                            file.bundle_options = getSubBundleOptions(options);
                        }
                        else
                        {
                            file.options        = lib.svcCatBundles.getForm(lCartItemFile.bundle_options, subOpt, subCatalog);
                            file.bundle_options = null;
                        }

                        if (funcs.nullsub(subCatalog.createSubscription, false) && subCatalog.subscribeIndividual)
                        {
                            file.requested_for_type= "individual";
                        }
                    }
                }
            }
        }
    }

    return file;
}

// According to the parameter, return the memory component file
// Warning: This function need to read the path from the related approval record
function getComponentMemFile(lCartItemFile, lApprovalTag)
{
    var file = new SCFile("svcCartItem");
    funcs.fduplicate(file, lCartItemFile);
    
    var relatedApproval = new SCFile("Approval", SCFILE_READONLY);
    relatedApproval.setFields(["component.path"]);
    var approvalSql = lib.DBUtils.getQueryByTag(lApprovalTag);
    if (relatedApproval.doSelect(approvalSql) == RC_SUCCESS)
    {
        var cp0 = relatedApproval.component_path[0];
        var path = cp0.path;
        var pathLen = funcs.lng(funcs.denull(path));
        if (pathLen > 1)
        {
            var nodeNbr = 1;
            do
            {
                var componentName = lib.Utilities.getElementFromTag(path[nodeNbr], 1);
                file = memeoryCartItem(file, componentName);
                
                nodeNbr++;
            } while (nodeNbr < pathLen);
        }
    }
    
    return file;
}

function getSubBundleOptions(lOptions)
{
    var rtnStr = "";
    if (lOptions != null)
    {
        var xml = new XML();
        if (xml.setContent(lOptions))
        {
            var form = xml.getFirstChildElement();
            if (form != null)
            {
                var node;
                node = form.getNextSiblingElement();
                while (node != null)
                {
                    rtnStr += node.toXMLString();
                    node = node.getNextSiblingElement();
                }
            }
        }
    }
    rtnStr = "<bundle>" + rtnStr + "</bundle>";
    
    return rtnStr;
}

// Used for replace this function in sl:ApprovalIntegration
function getComponentNameFromPath(lPath)
{
    var path = funcs.denull(lPath);
    var pathSize = funcs.lng(path);
    var tag = path[pathSize - 1];
    
    return lib.Utilities.getElementFromTag(tag, 1);
}


// whether skip to reset approval status 
function skipApproval(isChanged, finalstatus, currentstatus) {

	if (isChanged != null
		 && finalstatus != null
		 && isChanged == false
		 && finalstatus != "denied"
		 && currentstatus != "denied") {

		return true;

	} else {

		return false;
	}
}

function isUnsavedInteraction(file) {
	if (!file || !file["incident.id"]) {
		return true;
	}
	var inter = lib.c.$("incidents", SCFILE_READONLY).fields(["incident.id"]).select("incident.id=\"" + file["incident.id"] + "\"").uniqueResult();
	if (inter) {
		return false;
	}
	else {
		return true;
	}
}
