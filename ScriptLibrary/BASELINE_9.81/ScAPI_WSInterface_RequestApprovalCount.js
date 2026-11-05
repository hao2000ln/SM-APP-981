var log = lib.ScAPI_Logger.log("ScAPI_WSInterface_RequestApprovalCount");

var select = lib.ScAPI_RAD._select;
var NORMAL_EXIT = lib.ScAPI_Constants.NORMAL_EXIT();
var BAD_VALIDATION_EXIT = lib.ScAPI_Constants.BAD_VALIDATION_EXIT();
var setExitType = lib.ScAPI_Util.setExitType;
var setErrorMsg = lib.ScAPI_Util.setErrorMsg;
var getCurrentOperator = lib.ScAPI_Util.getCurrentOperator;
var count = lib.ScAPI_RAD._count;
var getMsg = lib.ScAPI_Util.getMessage;
var getAdvanceSearchSql = lib.ScAPI_WSInterface_Interaction_Inbox.getAdvanceSearchSql;


function getCount() {
	var conditions = vars.$L_file["conditions"]==null?"":vars.$L_file["conditions"];
	var showAll = (conditions=="");
	
	oper = getCurrentOperator();
	
	var fileName = "incidents";	
		
	var ownerQry = "category=\"service catalog\" and (opened.by.uid=\""+ oper["name"] +
		"\" or contact.name=\"" + oper["contact.name"] + "\" or callback.contact=\"" + oper["contact.name"] + "\") and open~=\"Closed\"";
		
	var advanceSearchSql = getAdvanceSearchSql(fileName, vars.$L_file['criteria']);
	
	if (advanceSearchSql) ownerQry = ownerQry + " and " + advanceSearchSql;
			
	var approvedQry = ownerQry + " and approval.status = \"approved\"";	
	var pendingQry = ownerQry + " and approval.status = \"pending\"";
	var deniedQry = ownerQry + " and approval.status = \"denied\"";
	
	
	
	

	if( conditions.indexOf("0")!=-1 || showAll){
		var approvedCount = count(fileName, approvedQry);
		vars.$L_file["approvedCount"] = approvedCount;
	}
	
	if( conditions.indexOf("1")!=-1 || showAll){
		var pendingCount = count(fileName, pendingQry);
		vars.$L_file["pendingCount"] = pendingCount;
	}
	
	if( conditions.indexOf("2")!=-1 || showAll){
		var deniedCount = count(fileName, deniedQry);
		vars.$L_file["deniedCount"] = deniedCount;
	}
	
	var ownerQry_s = "(opened.by.uid=\""+ oper["name"] + "\" or contact.name=\"" + oper["contact.name"] + "\" or callback.contact=\"" + oper["contact.name"] + "\")";
	
	if (advanceSearchSql) ownerQry_s = ownerQry_s + " and " + advanceSearchSql;
	
	var closedServiceCatalogQry      = ownerQry_s + " and category=\"service catalog\" and open=\"Closed\"";
	var openSupportRequestCountQry   = ownerQry_s + " and (category~=\"service catalog\" or category=NULL) and open~=\"Closed\"";
	var closedSupportRequestCountQry = ownerQry_s + " and (category~=\"service catalog\" or category=NULL) and open=\"Closed\"";
	if( conditions.indexOf("3")!=-1 || showAll){
		vars.$L_file['closedServiceCatalogCount'] = count(fileName, closedServiceCatalogQry);
	}
	if( conditions.indexOf("4")!=-1 || showAll){
		vars.$L_file['openSupportRequestCount']   = count(fileName, openSupportRequestCountQry);
	}
	if( conditions.indexOf("5")!=-1 || showAll){
		vars.$L_file['closedSupportRequestCount'] = count(fileName, closedSupportRequestCountQry);
	}
	
	if( conditions.indexOf("6")!=-1 || showAll){
		vars.$L_file['approvalCount'] = count('Approval', 
			lib.ScAPI_svcCatApprovals.generateSRCApprovalInboxSql());
	}
	
	setExitType(NORMAL_EXIT);
	if (log.isDebug()) log.debug("Return file is : " + vars.$L_file);
}
